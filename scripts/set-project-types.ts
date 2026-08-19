import { getCliClient } from "sanity/cli";

const PROJECT_TYPES = [
  { id: "project-paylinkz", projectType: "mobile-app" },
  { id: "project-machwerk", projectType: "web-app" },
  { id: "074f5441-02aa-409f-bb2d-a87b0176acbf", projectType: "web-app" },
] as const;

export default async function setProjectTypes() {
  const client = getCliClient({ apiVersion: "2026-08-17" });

  for (const project of PROJECT_TYPES) {
    await client.patch(project.id).set({ projectType: project.projectType }).commit();
    console.log(`Set ${project.id} → ${project.projectType}`);
  }
}

void setProjectTypes().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
