import { auth } from "@/auth";
import RecipeCard, { RecipeType } from "@/components/RecipeCard";
import SearchForm from "@/components/SearchForm";
import { RECIPE_QUERY } from "@/lib/query";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const { data: recipes } = await sanityFetch({ query: RECIPE_QUERY, params });
  const session = await auth()
  console.log(session) 
  return (
    <main>
      <section className="hero-container">
        <h1 className="hero-title">Discover & Share Amazing Recipes</h1>
        <p className="hero-subtitle">
          Join our community of food lovers and share your culinary masterpieces
          with the world
        </p>
        <SearchForm query={query} />
      </section>

      <section className="section-wrapper">
        <h2 className="text-heading mb-8">
          {query ? `Search Results for "${query}"` : "Latest Recipes"}
        </h2>

        {recipes.length > 0 ? (
          <ul className="grid-cards">
            {recipes.map((recipe) => (
              <RecipeCard recipe={recipe as RecipeType} key={recipe._id} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600">
              No recipes found. Why not be the first to create one?
            </p>
          </div>
        )}
      </section>

      <SanityLive />
    </main>
  );
}
