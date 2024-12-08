import { auth } from "@/auth";
import { FIND_USER_RECIPE_BY_ID_QUERY, GOOGLE_AUTHOR_QUERY } from "@/lib/query";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil, Mail, User } from "lucide-react";
import CarouselRecipe from "@/components/RecipeCard";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const id = (await params).id;
  const user = await client.fetch(GOOGLE_AUTHOR_QUERY, { id });
  const isOwnProfile = session?.user?.id === id;
  const detailsRecipes = await client.fetch(FIND_USER_RECIPE_BY_ID_QUERY, {
    id,
  });
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary-100 to-primary-50" />

          {/* Profile Info */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              <Image
                src={user.image}
                alt={user.name}
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-lg"
              />
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {user.name}
                  </h1>
                  {user.bio && (
                    <p className="mt-2 text-slate-600">{user.bio}</p>
                  )}
                </div>
                {isOwnProfile && (
                  <Button variant="outline">Edit Profile</Button>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4" />
                  <span>
                    Member since{" "}
                    {new Date(user._createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {/* Recipe Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            {detailsRecipes.length === 0
              ? "You still have no recipes published"
              : `Chef ${user.name}'s has ${detailsRecipes.length} recipes published`}
          </h2>

          {detailsRecipes.length ? (
            <div className="relative w-full">
              <CarouselRecipe recipe={detailsRecipes} items={2} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default page;
