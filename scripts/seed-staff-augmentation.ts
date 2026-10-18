/**
 * Publish the Staff Augmentation service to Sanity.
 *
 * Requires an Editor token in SANITY_API_WRITE_TOKEN.
 * Run: npm run seed:staff-augmentation
 *
 * Uses a fixed document id, so running it again updates the same service
 * and does not create a duplicate or change other documents.
 */
import { readFileSync } from "node:fs";
import { createClient } from "next-sanity";

import { staffAugmentationDocument } from "../src/sanity/content/staffAugmentation";
import { apiVersion, dataset, projectId } from "../src/sanity/env";

async function main() {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

  if (!token) {
    console.error(
      "Missing SANITY_API_WRITE_TOKEN. Create an Editor token in Sanity Manage, add it to .env.local, then run npm run seed:staff-augmentation.",
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const icon = await client.assets.upload(
    "image",
    readFileSync("public/services/staff-augmentation-icon.png"),
    { filename: "staff-augmentation-icon.png" },
  );

  const document = {
    ...staffAugmentationDocument(),
    icon: {
      _type: "image",
      alt: "Staff Augmentation icon",
      asset: {
        _type: "reference",
        _ref: icon._id,
      },
    },
  };

  const result = await client.createOrReplace(document);
  console.log(`Published ${result._id} (${result.slug?.current ?? "staff-augmentation"}).`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
