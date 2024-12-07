import * as z from "zod";
export const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  category: z.string().min(1, "Category is required"),
  cookingTime: z
    .number()
    .min(1, "Cooking time must be at least 1 minute")
    .max(300, "Cooking time cannot exceed 300 minutes"),
  servings: z
    .number()
    .min(1, "Must serve at least 1 person")
    .max(100, "Servings cannot exceed 100"),
  image: z
    .string()
    .url("Must be a valid URL")
    .refine((url) => {
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    }, "Must be a valid image URL"),
  ingredients: z
    .array(z.string())
    .min(1, "At least one ingredient is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  steps: z.string().min(1, "Steps are required"),
});
