import "server-only"
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, token } from "../env";

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // true ? CACHE the content for 60 seconds and revalidate the content after 60 sec : Set to false if statically generating pages, using ISR or tag-based revalidation
  token
});

