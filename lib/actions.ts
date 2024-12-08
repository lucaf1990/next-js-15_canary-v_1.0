"use server";
import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write";

export const createRecipe = async (state: unknown, form: FormData) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Invalid session",
      status: "error",
    });
  }

  try {
    const formData = Object.fromEntries(form);

    // Parse arrays from JSON strings
    const ingredients = JSON.parse(formData.ingredients as string);
    const tags = JSON.parse(formData.tags as string);

    // Create slug
    const baseSlug = slugify(formData.title as string, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Check if slug exists
    const existingRecipe = await client.fetch(
      `count(*[_type == "recipe" && slug.current == $slug])`,
      { slug: baseSlug },
    );

    // Create unique slug if needed
    let slug = baseSlug;
    if (existingRecipe > 0) {
      const slugCount = await client.fetch(
        `count(*[_type == "recipe" && slug.current match $slugPattern])`,
        { slugPattern: `${baseSlug}-*` },
      );
      slug = `${baseSlug}-${slugCount + 1}`;
    }

    const recipe = {
      _type: "recipe",
      title: formData.title,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.user?.id,
      },
      views: 0,
      image: formData.image,
      description: formData.description,
      category: (formData.category as string).toLowerCase(),
      ingredients: ingredients,
      tags: tags,
      steps: formData.steps,
      cookingTime: parseInt(formData.cookingTime as string),
      servings: parseInt(formData.servings as string),
    };
    const result = await writeClient.create(recipe);

    return parseServerActionResponse({
      data: result,
      status: "success",
      message: "Recipe created successfully",
      id: result._id,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return parseServerActionResponse({
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: "error",
    });
  }
};

export const patchRecipe = async (state: unknown, form: FormData) => {
  const session = await auth();

  if (!session) {
    return parseServerActionResponse({
      error: "Invalid session",
      status: "error",
    });
  }

  try {
    const formData = Object.fromEntries(form);

    const ingredients = JSON.parse(formData.ingredients as string);
    const tags = JSON.parse(formData.tags as string);
    const recipe = {
      _type: "recipe",
      title: formData.title,
      author: {
        _type: "reference",
        _ref: session?.user?.id,
      },
      views: 0,
      image: formData.image,
      description: formData.description,
      category: (formData.category as string).toLowerCase(),
      ingredients: ingredients,
      tags: tags,
      steps: formData.steps,
      cookingTime: parseInt(formData.cookingTime as string),
      servings: parseInt(formData.servings as string),
    };

    const result = await writeClient
      .patch(formData.id as string)
      .set(recipe)
      .commit();

    return parseServerActionResponse({
      data: result,
      status: "success",
      message: "Recipe created successfully",
      id: result._id,
    });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return parseServerActionResponse({
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: "error",
    });
  }
};
