import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

export function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
) {
  return client.fetch<T>(query, params, {
    next: { revalidate: 30 },
  });
}
