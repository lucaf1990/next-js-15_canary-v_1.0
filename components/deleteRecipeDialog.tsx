"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Delete } from "lucide-react";

type DeleteRecipeDialogProps = {
  deleteRecipe: () => Promise<void>;
};

const DeleteRecipeDialog = ({ deleteRecipe }: DeleteRecipeDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Delete className="w-4 h-4" />
          Delete Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            recipe.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form action={deleteRecipe}>
            <Button className="bg-primary-500" type="submit" variant="outline">
              Delete Recipe
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRecipeDialog;
