/**
 * Seed / replace homepage testimonials in Sanity with curated Upwork reviews.
 *
 * Requires a write-capable token:
 *   SANITY_API_WRITE_TOKEN=...
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/seed-upwork-testimonials.ts
 */

import { createClient } from "@sanity/client";

import { UPWORK_FEATURED_TESTIMONIALS } from "../src/lib/testimonials/upwork";

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  const apiVersion =
    process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2026-08-17";
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

  if (!projectId) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  }
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN. Create a token with Editor permissions in Sanity → API → Tokens.",
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const demoIds = await client.fetch<string[]>(
    `*[_type == "testimonial" && (_id match "testimonial-demo-*" || name match "*Demo*")][]._id`,
  );

  const tx = client.transaction();

  for (const id of demoIds) {
    tx.delete(id);
  }

  for (const item of UPWORK_FEATURED_TESTIMONIALS) {
    tx.createOrReplace({
      _id: item._id,
      _type: "testimonial",
      name: item.name,
      role: item.role,
      company: item.company,
      content: item.content,
      rating: item.rating,
      featured: true,
    });
  }

  const result = await tx.commit();
  console.log(
    `Done. Deleted ${demoIds.length} demo testimonial(s), upserted ${UPWORK_FEATURED_TESTIMONIALS.length} Upwork review(s).`,
  );
  console.log(`Transaction: ${result.transactionId}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
