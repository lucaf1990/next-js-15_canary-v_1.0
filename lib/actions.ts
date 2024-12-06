"use server"
import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils"
import slugify from 'slugify'
import { client } from "@/sanity/lib/client"
import { writeClient } from "@/sanity/lib/write"

export const createRecipe = async (state: any, form: FormData) => {
  const session = await auth()
  
  if(!session) {
    return parseServerActionResponse({
      error: "Invalid session",
      status: "error"
    })
  }

  try {
    // Get all form data
    const title = form.get('title') as string
    const description = form.get('description') as string
    const category = form.get('category') as string
    const ingredients = JSON.parse(form.get('ingredients') as string)
    const tags = JSON.parse(form.get('tags') as string)
    const steps = form.get('steps') as string
    const image = form.get('image') as string
    const cookingTime = Number(form.get('cookingTime'))
    const servings = Number(form.get('servings'))

    // Create slug
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    })

    // Check if slug exists
    const existingRecipe = await client.fetch(
      `count(*[_type == "recipe" && slug.current == $slug])`,
      { slug: baseSlug }
    )

    // Create unique slug if needed
    let slug = baseSlug
    if (existingRecipe > 0) {
      const slugCount = await client.fetch(
        `count(*[_type == "recipe" && slug.current match $slugPattern])`,
        { slugPattern: `${baseSlug}-*` }
      )
      slug = `${baseSlug}-${slugCount + 1}`
    }

    // Create recipe document
    const recipe = {
      _type: "recipe",
      title,
      slug: {
        _type: "slug",
        current: slug
      },
      author: {
        _type: "reference",
        _ref: session?.user?.id?.toString()
      },
      views: 0, // Initial value
      image,
      description,
      category: category.toLowerCase(),
      ingredients,
      tags,
      steps,
      cookingTime,
      servings
    }

    const result = await writeClient.create(recipe)
    
    return parseServerActionResponse({
      data: result,
      status: "success",
      message: "Recipe created successfully",
      id: result._id // Include the ID for redirection
    })

  } catch (error) {
    console.error('Error creating recipe:', error)
    return parseServerActionResponse({
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: "error"
    })
  }
}