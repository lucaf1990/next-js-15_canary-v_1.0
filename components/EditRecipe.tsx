"use client";
import React, { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Send, BookOpen, Tag, Edit, AlertCircle } from "lucide-react";
import { RECIPE_QUERY_BY_IDResult } from "@/sanity/types";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { formSchema } from "@/lib/zValidation";
import * as z from "zod";
import { patchRecipe } from "@/lib/actions";

type FormState = {
  status: "INITIAL" | "success" | "error";
  error?: string;
  id?: string;
};

const ViewRecipeDialog = ({
  recipe,
}: {
  recipe: NonNullable<RECIPE_QUERY_BY_IDResult>;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients);
  const [tags, setTags] = useState<string[]>(recipe.tags);
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    status: "INITIAL",
    error: "",
  });

  async function handleFormSubmit(prevState: FormState, formData: FormData) {
    try {
      const enhancedFormData = new FormData();

      for (const [key, value] of formData.entries()) {
        enhancedFormData.append(key, value);
      }

      enhancedFormData.append("ingredients", JSON.stringify(ingredients));
      enhancedFormData.append("tags", JSON.stringify(tags));
      enhancedFormData.append("id", recipe._id);

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
      const result = await patchRecipe(prevState, enhancedFormData);

      if (result.status === "success") {
        toast({
          title: "Success!",
          description: "Your recipe has been updated successfully.",
          variant: "default",
          className: "bg-green-500 text-white",
        });
        setOpen(false);
        router.refresh();
        return result;
      }
      return result;
    } catch (error) {
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
        className: "bg-red-500 text-white",
      });
      return { ...prevState, error: "Something went wrong", status: "error" };
    }
  }

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

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Edit Recipe</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-6">
          {state.error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {state.error}
            </div>
          )}
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="form-group">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={recipe.title}
                  className="form-input"
                  required
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
                  defaultValue={recipe.description}
                  className="form-textarea"
                  required
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
                  <Select name="category" defaultValue={recipe.category}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Appetizer">Appetizer</SelectItem>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Dessert">Dessert</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Snack">Snack</SelectItem>
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
                    defaultValue={recipe.cookingTime}
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
                    defaultValue={recipe.servings}
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
                  defaultValue={recipe.image}
                  className="form-input"
                  required
                  type="url"
                />
                {errors.image && (
                  <p className="text-sm text-red-500 mt-1">{errors.image}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="recipe-section-title flex items-center gap-2">
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
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="recipe-section-title flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Preparation Steps
              </h2>
              <Textarea
                name="steps"
                defaultValue={recipe.steps}
                className="form-textarea"
                rows={6}
                required
              />
              {errors.steps && (
                <p className="text-sm text-red-500 mt-1">{errors.steps}</p>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="recipe-section-title flex items-center gap-2">
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
              </div>
              {errors.tags && (
                <p className="text-sm text-red-500">{errors.tags}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              disabled={isPending}
              type="submit"
              className="button-primary"
            >
              {isPending ? "Submitting changes..." : "Save Changes"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ViewRecipeDialog;
