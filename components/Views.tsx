import React from "react";
import { client } from "@/sanity/lib/client";
import { VIEWS_QUERY_BY_ID } from "@/lib/query";
import { writeClient } from "@/sanity/lib/write";
import { unstable_after as after } from "next/server";
const Views = async ({ id }: { id: string }) => {
  const totalViews = (await client
    .withConfig({ useCdn: false })
    .fetch(VIEWS_QUERY_BY_ID, { id })) || { views: 0 };

   after(async () => {
  await writeClient
    .patch(id)
    .set({ views: totalViews.views + 1 })
    .commit();
})
  return (
    <div>
      <div className="absolute -top-2 -right-2">
      </div>
      <p className="recipe-stat-value">
        <span>{totalViews?.views}</span>
      </p>
    </div>
  );
};

export default Views;
