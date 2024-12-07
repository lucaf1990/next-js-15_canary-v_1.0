import { defineQuery } from "next-sanity";

export const RECIPE_QUERY = defineQuery(`*[_type == "recipe" 
    && defined(slug.current) 
    && !defined($search) || title match $search || category match $search || author->name match $search] 
    | order(_createdAt desc) {
    _id,
    _createdAt,
    author -> {
      _id,
      name,
      image,
      bio,
    },
    title,
    views,
    image,
    description,
    category,
}`);

export const RECIPE_QUERY_BY_ID =
  defineQuery(`*[_type == "recipe" && _id == $id][0]{
    _id,
    _createdAt,
    slug,
    author -> {
      _id,
      name,
      image,
      bio,
      username,
    },
    title,
    views,
    image,
    description,
    category,
    ingredients,
    tags,
    steps,
    cookingTime,
    servings,
}`);

export const VIEWS_QUERY_BY_ID =
  defineQuery(`*[_type == "recipe" && _id == $id][0]{
  _id,
  views
  }`);

export const GITHUB_AUTHOR_QUERY = `
  *[_type == "author" && id == $id][0] {
    _id,
    name,
    email,
    image
  }
`;

export const GOOGLE_AUTHOR_QUERY = `
  *[_type == "author" && id == $id][0] {
    _id,
    name,
    email,
    image
  }
`;
