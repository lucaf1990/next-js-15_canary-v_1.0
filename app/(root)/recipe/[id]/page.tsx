import { RECIPE_QUERY_BY_ID } from "@/lib/query";
import { client } from "@/sanity/lib/client";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";
import Image from "next/image";
import { Clock, Users, ChefHat, UtensilsCrossed, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Views from "@/components/Views";
import { auth } from "@/auth";
import ViewRecipeDialog from "@/components/EditRecipe";

import { writeClient } from "@/sanity/lib/write";
import DeleteRecipeDialog from "@/components/deleteRecipeDialog";

export const experimental_ppr = true;
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = (await params).id;
  const recipe = await client
    .withConfig({ useCdn: false })
    .fetch(RECIPE_QUERY_BY_ID, { id });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${recipe?.title} | Recipe`,
    description: recipe?.description,
    authors: [{ name: recipe?.author.name || "" }],
    openGraph: {
      title: recipe?.title,
      description: recipe?.description,
      images: [
        {
          url: recipe?.image || "",
          width: 1200,
          height: 630,
          alt: recipe?.title,
        },
        ...previousImages,
      ],
      type: "article",
      publishedTime: recipe?._createdAt,
      authors: recipe?.author.name,
    },
    keywords: recipe?.tags,
    category: recipe?.category,
  };
}
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const detailsRecipes = await client
    .withConfig({ useCdn: false })
    .fetch(RECIPE_QUERY_BY_ID, { id });

  if (!detailsRecipes) return notFound();
  const session = await auth();
  console.log(detailsRecipes);
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-30">
        <div className="pb-10 pt-10">
          {session?.user?.id === detailsRecipes.author._id && (
            <div className="flex gap-2 mb-4">
              <ViewRecipeDialog recipe={detailsRecipes} />
              <DeleteRecipeDialog
                deleteRecipe={async () => {
                  "use server";
                  await writeClient.delete(id);
                  redirect("/");
                }}
              />
            </div>
          )}
          <div>
            <h1 className="recipe-hero-title">{detailsRecipes.title}</h1>
            <p className="recipe-description mt-4">
              {detailsRecipes.description}
            </p>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="relative h-[45vh] min-h-[400px] max-h-[500px] w-full lg:w-3/4">
            <Image
              src={detailsRecipes.image}
              alt={detailsRecipes.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <span className="absolute top-6 left-6 recipe-category-badge">
              <ChefHat className="w-4 h-4 mr-2" />
              {detailsRecipes.category}
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 top-[-30px] relative z-10">
        <div className="recipe-stats-grid">
          <div className="recipe-stat-card">
            <Clock className="recipe-stat-icon" />
            <div>
              <p className="recipe-stat-value">
                {detailsRecipes.cookingTime} mins
              </p>
              <p className="recipe-stat-label">Cooking Time</p>
            </div>
          </div>
          <div className="recipe-stat-card">
            <Users className="recipe-stat-icon" />
            <div>
              <p className="recipe-stat-value">{detailsRecipes.servings}</p>
              <p className="recipe-stat-label">Servings</p>
            </div>
          </div>
          <div className="recipe-stat-card">
            <Eye className="recipe-stat-icon animate-pulse opacity-90" />
            <div>
              <Suspense fallback={<Skeleton className="" />}>
                <Views id={detailsRecipes._id} />
              </Suspense>

              <p className="recipe-stat-label">
                {detailsRecipes.views > 1 ? `Views` : `View`}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="recipe-author-card">
              <div className="relative w-20 h-20">
                <Image
                  src={detailsRecipes?.author.image || ""}
                  alt={detailsRecipes?.author?.name || ""}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="recipe-author-name">
                  {detailsRecipes?.author?.name}
                </h3>
                <p className="recipe-author-bio">
                  {detailsRecipes?.author?.bio}
                </p>
              </div>
            </div>

            <div className="recipe-ingredients-card">
              <h2 className="recipe-section-title">
                <ChefHat className="w-5 h-5" />
                Ingredients
              </h2>
              <ul className="recipe-ingredients-list">
                {detailsRecipes.ingredients.map(
                  (ingredient: string, index: number) => (
                    <li key={index} className="recipe-ingredient-item">
                      <span className="recipe-ingredient-checkbox" />
                      {ingredient}
                    </li>
                  ),
                )}
              </ul>
              <div className="recipe-tags-container">
                {detailsRecipes.tags.map((tag: string, i: number) => (
                  <span key={i} className="recipe-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="recipe-content-card">
              <div>
                <h2 className="recipe-section-title">
                  <UtensilsCrossed className="w-5 h-5" />
                  Instructions
                </h2>
                <div className="recipe-instructions">
                  {detailsRecipes.steps
                    .split("\n")
                    .map((step: string, index: number) => {
                      return (
                        <li
                          key={index}
                          className="text-gray-700 leading-relaxed pl-2 list-none"
                        >
                          {step}
                        </li>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
