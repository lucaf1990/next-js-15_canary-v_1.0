import { RECIPE_QUERY_BY_ID } from "@/lib/query";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import Image from "next/image";
import { Clock, Users, ChefHat, UtensilsCrossed, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Views from "@/components/Views";

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const detailsRecipes = await client.fetch(RECIPE_QUERY_BY_ID, { id });
  if (!detailsRecipes) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Full-width hero image with overlay */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-30">
        {/* Title and description section */}
        <div className="pb-10 pt-10">
          <div>
            <h1 className="recipe-hero-title">{detailsRecipes.title}</h1>
            <p className="recipe-description mt-4">
              {detailsRecipes.description}
            </p>
          </div>
        </div>

        {/* Image section */}
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
      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 top-[-30px] relative z-10">
        {/* Stats cards */}
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
              <Suspense fallback={<Skeleton className=""/>}>
              <Views id={detailsRecipes._id}/>
              </Suspense>

              <p className="recipe-stat-label">{detailsRecipes.views > 1 ? `Views` : `View`}</p>
            </div>
          </div>
        </div>

        {/* Two-column layout for main content */}
        <div className="mt-12 grid lg:grid-cols-5 gap-8">
          {/* Left column - Author and ingredients */}
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
                  )
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

          {/* Right column - Description and steps */}
          <div className="lg:col-span-3">
            <div className="recipe-content-card">
              <div>
                <h2 className="recipe-section-title">
                  <UtensilsCrossed className="w-5 h-5" />
                  Instructions
                </h2>
                <div className="recipe-instructions">
                  {detailsRecipes.steps}
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
