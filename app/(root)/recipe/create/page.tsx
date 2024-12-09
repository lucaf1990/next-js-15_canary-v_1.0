"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChefHat, Clock, Send, AlertCircle, BookOpen, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRecipe } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { formSchema } from "@/lib/zValidation";

type FormState = {
  status: "INITIAL" | "success" | "error";
  error?: string;
  id?: string;
};

const RecipeForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    status: "INITIAL",
    error: "",
  });

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients((prev) => [...prev, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim()) {
      setTags((prev) => [...prev, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleFormSubmit(prevState: FormState, formData: FormData) {
    try {
      // Create a new FormData instance to add our arrays
      const enhancedFormData = new FormData();

      // Copy existing form data
      for (const [key, value] of formData.entries()) {
        enhancedFormData.append(key, value);
      }

      // Add arrays as JSON strings
      enhancedFormData.append("ingredients", JSON.stringify(ingredients));
      enhancedFormData.append("tags", JSON.stringify(tags));

      // Validate using schema
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        cookingTime: Number(formData.get("cookingTime")),
        servings: Number(formData.get("servings")),
        image: formData.get("image") as string,
        ingredients,
        tags,
        steps: formData.get("steps") as string,
      };

      await formSchema.parseAsync(formValues);

      // Send enhanced form data
      const result = await createRecipe(prevState, enhancedFormData);

      if (result.status === "success") {
        toast({
          title: "Success!",
          description: "Your recipe has been created successfully.",
        });
        router.push(`/recipe/${result.id}`);
      }
      return result;
    } catch (error) {
      console.error("Form Submission Error:", error);

      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string>);
        toast({
          title: "Validation Error",
          description: "Please check all required fields",
          variant: "destructive",
        });
        return { ...prevState, error: "Validation failed", status: "error" };
      }

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return { ...prevState, error: "Something went wrong", status: "error" };
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="container-section">
        <h1 className="heading-hero">Create Your Recipe</h1>
        <p className="sub-heading-hero">
          Share your culinary masterpiece with the world
        </p>
      </div>

      <div className="section-wrapper">
        <form action={formAction} className="max-w-3xl mx-auto space-y-8">
          {state.error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {state.error}
            </div>
          )}

          <div className="recipe-form-card">
            <h2 className="recipe-section-title">
              <ChefHat className="h-5 w-5" />
              Recipe Details
            </h2>

            <div className="space-y-4">
              <div className="form-group">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  className="form-input"
                  required
                  placeholder="Enter recipe title"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div className="form-group">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  required
                  placeholder="Describe your recipe"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {[
                        "Breakfast",
                        "Lunch",
                        "Dinner",
                        "Dessert",
                        "Snack",
                        "Appetizer",
                      ].map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="cookingTime">Cooking Time (mins)</Label>
                  <Input
                    id="cookingTime"
                    name="cookingTime"
                    type="number"
                    className="form-input"
                    required
                    min={1}
                    max={300}
                  />
                  {errors.cookingTime && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.cookingTime}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    name="servings"
                    type="number"
                    className="form-input"
                    required
                    min={1}
                    max={100}
                  />
                  {errors.servings && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.servings}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  className="form-input"
                  required
                  placeholder="Enter image URL"
                  type="url"
                />
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          <div className="recipe-form-card">
            <h2 className="recipe-section-title">
              <BookOpen className="h-5 w-5" />
              Ingredients
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  placeholder="Add an ingredient"
                  onKeyPress={(e) => handleKeyPress(e, addIngredient)}
                  className="form-input"
                />
                <Button type="button" onClick={addIngredient}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span key={index} className="ingredient-tag">
                    {ingredient}
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="ml-2 text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.ingredients && (
                <p className="text-sm text-red-500">{errors.ingredients}</p>
              )}
            </div>
          </div>

          <div className="recipe-form-card">
            <h2 className="recipe-section-title">
              <Clock className="h-5 w-5" />
              Preparation Steps
            </h2>
            <Textarea
              name="steps"
              className="form-textarea"
              placeholder="Describe the preparation steps"
              rows={6}
              required
            />
            {errors.steps && (
              <p className="text-sm text-red-500 mt-1">{errors.steps}</p>
            )}
          </div>

          <div className="recipe-form-card">
            <h2 className="recipe-section-title">
              <Tag className="h-5 w-5" />
              Tags
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => handleKeyPress(e, addTag)}
                  className="form-input"
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-modern">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-indigo-400 hover:text-indigo-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.tags && (
                <p className="text-sm text-red-500">{errors.tags}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="button-primary"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Create Recipe"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RecipeForm;
