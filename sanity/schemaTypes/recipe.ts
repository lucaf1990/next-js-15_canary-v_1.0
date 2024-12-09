import { defineField, defineType } from "sanity";

export const recipe = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "views",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ingredients",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "steps",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cookingTime",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "servings",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
