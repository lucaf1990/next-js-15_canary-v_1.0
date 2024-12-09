import { EyeIcon, ChefHat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FIND_USER_RECIPE_BY_ID_QUERYResult,
  RECIPE_QUERYResult,
} from "@/sanity/types";
import { formatDate } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "./ui/carousel";

export type RecipeType =
  | RECIPE_QUERYResult[number]
  | FIND_USER_RECIPE_BY_ID_QUERYResult[number];

const RecipeCard = ({ recipe }: { recipe: RecipeType }) => {
  const {
    _createdAt,
    views,
    author,
    title,
    _id,
    description,
    image,
    category,
    tags,
  } = recipe;

  return (
    <li className="recipe-card group">
      <div className="recipe-card-image-wrapper">
        <Image
          src={image || ""}
          alt={title || "Recipe"}
          width={500}
          height={300}
          className="recipe-card-image"
        />
        <div className="recipe-card-overlay" />
        <Link href={`/?query=${category?.toLowerCase()}`}>
          <span className="recipe-card-category">
            <ChefHat className="w-4 h-4 inline-block mr-2" />
            {category}
          </span>
        </Link>
      </div>

      <div className="recipe-card-content">
        <div className="recipe-card-header">
          <Link href={`/user/${author?._id}`}>
            <div className="recipe-card-author">
              <Image
                src={
                  author?.image ||
                  "https://cdn-icons-png.flaticon.com/512/10337/10337609.png"
                }
                alt={author?.name || "Author"}
                width={40}
                height={40}
                className="recipe-card-author-image"
              />
              <div>
                <p className="font-medium text-slate-900">{author?.name}</p>
                <p className="text-sm text-slate-500">
                  {formatDate(_createdAt)}
                </p>
              </div>
            </div>
          </Link>
          <div className="recipe-card-stats">
            <EyeIcon className="h-4 w-4" />
            <span>{views}</span>
          </div>
        </div>

        <div className="recipe-card-main">
          <div>
            <Link href={`/recipe/${_id}`}>
              <h3 className="recipe-card-title">{title}</h3>
            </Link>
            <p className="recipe-card-description">{description}</p>
          </div>

          <div className="recipe-card-footer">
            {tags?.slice(0, 3).map((tag: string, i: number) => (
              <span key={i} className="recipe-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
};
const CarouselRecipe = ({ recipe }: { recipe: RecipeType[] }) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
    >
      <div className="group relative mx-10">
        <CarouselContent className="-ml-4">
          {recipe.map((recipe) => (
            <CarouselItem
              key={recipe._id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <RecipeCard recipe={recipe} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-primary-500  text-white  absolute -left-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
        <CarouselNext className="bg-primary-500 text-white absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Carousel>
  );
};

export default CarouselRecipe;
