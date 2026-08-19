import { getCliClient } from "sanity/cli";

const themes = [
  {
    id: "074f5441-02aa-409f-bb2d-a87b0176acbf",
    name: "AMI",
    lightTheme: {
      _type: "projectColorTheme",
      primary: "#234B97",
      secondary: "#00A9E2",
      background: "#FFFFFF",
      text: "#031633",
      mutedText: "#4A5369",
      border: "#BACBE6",
      surface: "#F4F7FB",
    },
    darkTheme: {
      _type: "projectColorTheme",
      primary: "#63ACE1",
      secondary: "#00AFE8",
      background: "#031633",
      text: "#FFFFFF",
      mutedText: "#A6B5CC",
      border: "#325774",
      surface: "#052C65",
    },
    typography: {
      _type: "projectTypography",
      fontFamily: "Open Sans",
      fontWeight: "600",
    },
  },
  {
    id: "project-paylinkz",
    name: "PayLinkz",
    lightTheme: {
      _type: "projectColorTheme",
      primary: "#1E4B8A",
      secondary: "#3B82F6",
      background: "#FFFFFF",
      text: "#0B1220",
      mutedText: "#5B6B80",
      border: "#D7E2EE",
      surface: "#F5F8FC",
    },
    darkTheme: {
      _type: "projectColorTheme",
      primary: "#60A5FA",
      secondary: "#3B82F6",
      background: "#0B1220",
      text: "#F8FAFC",
      mutedText: "#94A3B8",
      border: "#1E3A5F",
      surface: "#12203A",
    },
    typography: {
      _type: "projectTypography",
      fontFamily: "Roboto",
      fontWeight: "500",
    },
  },
  {
    id: "project-machwerk",
    name: "Machwerk",
    lightTheme: {
      _type: "projectColorTheme",
      primary: "#0076FF",
      secondary: "#025ABF",
      background: "#FFFFFF",
      text: "#262626",
      mutedText: "#6C7075",
      border: "#D4D7D9",
      surface: "#F1F1F1",
    },
    darkTheme: {
      _type: "projectColorTheme",
      primary: "#1876FF",
      secondary: "#0076FF",
      background: "#262626",
      text: "#FFFFFF",
      mutedText: "#BFC7D3",
      border: "#414141",
      surface: "#353534",
    },
    typography: {
      _type: "projectTypography",
      fontFamily: "Montserrat",
      fontWeight: "600",
    },
  },
] as const;

export default async function setProjectThemes() {
  const client = getCliClient({ apiVersion: "2026-08-17" });

  for (const project of themes) {
    await client
      .patch(project.id)
      .set({
        lightTheme: project.lightTheme,
        darkTheme: project.darkTheme,
        typography: project.typography,
      })
      .commit();
    console.log(`Updated theme for ${project.name} (${project.id})`);
  }
}

void setProjectThemes().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
