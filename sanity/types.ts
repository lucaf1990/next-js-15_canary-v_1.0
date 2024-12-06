/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type Recipe = {
  _id: string;
  _type: "recipe";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: Slug;
  author: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "author";
  };
  views: number;
  image: string;
  description: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Dessert" | "Snack" | "Appetizer";
  ingredients: Array<string>;
  tags: Array<string>;
  steps: string;
  cookingTime: number;
  servings: number;
};

export type Slug = {
  _type: "slug";
  current: string;
  source?: string;
};

export type Author = {
  _id: string;
  _type: "author";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  bio?: string;
};

export type AllSanitySchemaTypes = SanityImagePaletteSwatch | SanityImagePalette | SanityImageDimensions | SanityImageHotspot | SanityImageCrop | SanityFileAsset | SanityImageAsset | SanityImageMetadata | Geopoint | SanityAssetSourceData | Recipe | Slug | Author;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: lib/query.ts
// Variable: RECIPE_QUERY
// Query: *[_type == "recipe"     && defined(slug.current)     && !defined($search) || title match $search || category match $search || author->name match $search]     | order(_createdAt desc) {    _id,    _createdAt,    author -> {      _id,      name,      image,      bio,    },    title,    views,    image,    description,    category,}
export type RECIPE_QUERYResult = Array<{
  _id: string;
  _createdAt: string;
  author: null;
  title: null;
  views: null;
  image: string | null;
  description: null;
  category: null;
} | {
  _id: string;
  _createdAt: string;
  author: null;
  title: string | null;
  views: null;
  image: null;
  description: string | null;
  category: null;
} | {
  _id: string;
  _createdAt: string;
  author: {
    _id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
  };
  title: string;
  views: number;
  image: string;
  description: string;
  category: "Appetizer" | "Breakfast" | "Dessert" | "Dinner" | "Lunch" | "Snack";
}>;
// Variable: RECIPE_QUERY_BY_ID
// Query: *[_type == "recipe" && _id == $id][0]{    _id,    _createdAt,    slug,    author -> {      _id,      name,      image,      bio,      username,    },    title,    views,    image,    description,    category,    ingredients,    tags,    steps,    cookingTime,    servings,}
export type RECIPE_QUERY_BY_IDResult = {
  _id: string;
  _createdAt: string;
  slug: Slug;
  author: {
    _id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    username: string | null;
  };
  title: string;
  views: number;
  image: string;
  description: string;
  category: "Appetizer" | "Breakfast" | "Dessert" | "Dinner" | "Lunch" | "Snack";
  ingredients: Array<string>;
  tags: Array<string>;
  steps: string;
  cookingTime: number;
  servings: number;
} | null;
// Variable: VIEWS_QUERY_BY_ID
// Query: *[_type == "recipe" && _id == $id][0]{  _id,  views  }
export type VIEWS_QUERY_BY_IDResult = {
  _id: string;
  views: number;
} | null;

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    "*[_type == \"recipe\" \n    && defined(slug.current) \n    && !defined($search) || title match $search || category match $search || author->name match $search] \n    | order(_createdAt desc) {\n    _id,\n    _createdAt,\n    author -> {\n      _id,\n      name,\n      image,\n      bio,\n    },\n    title,\n    views,\n    image,\n    description,\n    category,\n}": RECIPE_QUERYResult;
    "*[_type == \"recipe\" && _id == $id][0]{\n    _id,\n    _createdAt,\n    slug,\n    author -> {\n      _id,\n      name,\n      image,\n      bio,\n      username,\n    },\n    title,\n    views,\n    image,\n    description,\n    category,\n    ingredients,\n    tags,\n    steps,\n    cookingTime,\n    servings,\n}": RECIPE_QUERY_BY_IDResult;
    "*[_type == \"recipe\" && _id == $id][0]{\n  _id,\n  views\n  }": VIEWS_QUERY_BY_IDResult;
  }
}
