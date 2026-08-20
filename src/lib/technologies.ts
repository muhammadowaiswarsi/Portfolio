import {
  AppWindow,
  Braces,
  Cloud,
  Code,
  Component,
  Container as ContainerIcon,
  CreditCard,
  Cpu,
  Cylinder,
  Database,
  FileCode2,
  Flame,
  Globe,
  Layers,
  Mail,
  Paintbrush,
  Route,
  Server,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  Table2,
  TabletSmartphone,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

type TechDefinition = {
  display: string;
  aliases: string[];
  icon: LucideIcon;
};

const catalog: TechDefinition[] = [
  { display: "React Native", aliases: ["react native", "reactnative"], icon: Smartphone },
  { display: "Tailwind CSS", aliases: ["tailwind css", "tailwindcss", "tailwind"], icon: Wind },
  { display: "Framer Motion", aliases: ["framer motion", "framermotion", "framer"], icon: Sparkles },
  { display: "TypeScript", aliases: ["typescript", "ts"], icon: FileCode2 },
  { display: "JavaScript", aliases: ["javascript", "js"], icon: FileCode2 },
  { display: "Next.js", aliases: ["next.js", "nextjs", "next"], icon: AppWindow },
  { display: "Node.js", aliases: ["node.js", "nodejs", "node"], icon: Server },
  { display: "Express.js", aliases: ["express.js", "expressjs", "express"], icon: Route },
  { display: "NestJS", aliases: ["nestjs", "nest"], icon: Layers },
  { display: "PostgreSQL", aliases: ["postgresql", "postgres"], icon: Database },
  { display: "MongoDB", aliases: ["mongodb", "mongo"], icon: Cylinder },
  { display: "GraphQL", aliases: ["graphql"], icon: Share2 },
  { display: "AWS SES", aliases: ["aws ses", "amazonses", "amazon ses"], icon: Mail },
  { display: "AWS Lambda", aliases: ["aws lambda", "awslambda", "lambda"], icon: Zap },
  { display: "AWS Cognito", aliases: ["cognito", "aws cognito", "amazon cognito"], icon: Shield },
  { display: "AWS Amplify", aliases: ["amplify", "aws amplify"], icon: Layers },
  { display: "Amazon DynamoDB", aliases: ["dynamodb", "amazon dynamodb", "aws dynamodb"], icon: Database },
  { display: "AWS AppSync", aliases: ["appsync", "aws appsync", "amazon appsync"], icon: Share2 },
  { display: "Amazon S3", aliases: ["s3", "amazon s3", "aws s3"], icon: Cloud },
  { display: "Amazon RDS", aliases: ["rds", "amazon rds", "aws rds"], icon: Database },
  { display: "React", aliases: ["react", "reactjs", "react.js", "react js"], icon: Component },
  { display: "Python", aliases: ["python"], icon: Braces },
  { display: "Flutter", aliases: ["flutter"], icon: TabletSmartphone },
  { display: "MySQL", aliases: ["mysql"], icon: Table2 },
  { display: "OpenAI", aliases: ["openai"], icon: Sparkles },
  { display: "Firebase", aliases: ["firebase"], icon: Flame },
  { display: "Mixpanel", aliases: ["mixpanel"], icon: Sparkles },
  { display: "Heroku", aliases: ["heroku"], icon: Cloud },
  { display: "Docker", aliases: ["docker"], icon: ContainerIcon },
  { display: "Sanity", aliases: ["sanity", "sanity cms"], icon: FileCode2 },
  { display: "Vercel", aliases: ["vercel"], icon: Globe },
  { display: "Stripe", aliases: ["stripe"], icon: CreditCard },
  { display: "Redis", aliases: ["redis"], icon: Database },
  { display: "HTML", aliases: ["html", "html5"], icon: Code },
  { display: "CSS", aliases: ["css", "css3"], icon: Paintbrush },
  { display: "AWS", aliases: ["aws", "amazon web services"], icon: Cloud },
  { display: "Vite", aliases: ["vite"], icon: Zap },
  { display: "WordPress", aliases: ["wordpress", "wp"], icon: Globe },
  { display: "Elementor", aliases: ["elementor"], icon: Paintbrush },
  { display: "Cloudflare", aliases: ["cloudflare"], icon: Cloud },
];

function compact(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function aliasPattern(alias: string) {
  const escaped = alias
    .split(/\s+/)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("[\\s.]*");

  return new RegExp(`^${escaped}(?=$|[\\s,;|/])`, "i");
}

function findTech(name: string) {
  const key = compact(name);

  return (
    catalog.find(
      (tech) =>
        compact(tech.display) === key ||
        tech.aliases.some((alias) => compact(alias) === key),
    ) ?? null
  );
}

export function getTechMeta(name: string): { label: string; icon: LucideIcon } {
  const match = findTech(name);

  return {
    label: match?.display ?? name.trim(),
    icon: match?.icon ?? Cpu,
  };
}

function parseTechString(value: string) {
  const source = value.replace(/\s+/g, " ").trim();
  if (!source) return [];

  if (findTech(source)) {
    return [getTechMeta(source).label];
  }

  const aliases = catalog
    .flatMap((tech) =>
      tech.aliases.map((alias) => ({
        alias,
        display: tech.display,
        length: alias.length,
      })),
    )
    .sort((a, b) => b.length - a.length);

  const labels: string[] = [];
  let remaining = source;

  while (remaining.length > 0) {
    remaining = remaining.replace(/^[\s,;|/]+/, "");
    if (!remaining) break;

    const match = aliases.find((entry) => aliasPattern(entry.alias).test(remaining));

    if (match) {
      const consumed = remaining.match(aliasPattern(match.alias))?.[0] ?? match.alias;
      labels.push(match.display);
      remaining = remaining.slice(consumed.length);
      continue;
    }

    const token = remaining.match(/^[^\s,;|/]+/)?.[0] ?? remaining;
    labels.push(token.trim());
    remaining = remaining.slice(token.length);
  }

  const parsed = labels.filter(Boolean);
  const knownCount = parsed.filter((label) => findTech(label)).length;

  // Keep CMS values like "Custom CMS" as one chip unless this is clearly a list.
  if (knownCount < 2) {
    return [source];
  }

  return parsed;
}

export function expandTechnologies(items: string[]) {
  const labels = items.flatMap((item) =>
    item
      .split(/[,;|/]+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .flatMap(parseTechString),
  );

  return [...new Set(labels)];
}
