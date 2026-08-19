export type SanitySlug = {
  _type: "slug";
  current: string;
};

export type SanityImage = {
  _type: "image";
  alt?: string;
  asset: {
    _ref: string;
    _type: "reference";
  };
};

export type CaseStudyItem = {
  _key?: string;
  _type?: "caseStudyItem";
  title?: string | null;
  description?: string | null;
  image?: SanityImage | null;
};

export type CaseStudyChallenge = {
  _key?: string;
  _type?: "caseStudyChallenge";
  title?: string | null;
  description?: string | null;
};

export type ProjectClientTestimonial = {
  _type?: "projectClientTestimonial";
  quote?: string | null;
  name?: string | null;
  role?: string | null;
  company?: string | null;
  avatar?: SanityImage | null;
  rating?: number | null;
};

export type Project = {
  _id: string;
  _type: "project";
  title: string;
  slug: SanitySlug;
  shortDescription: string;
  description: unknown[];
  thumbnail: SanityImage;
  cardImage?: SanityImage;
  technologies: string[];
  featured?: boolean;
  projectType?: "mobile-app" | "web-app";
  industry?: string;
  businessType?: string;
  servicesProvided?: string[];
  projectGoals?: CaseStudyItem[];
  challenges?: CaseStudyChallenge[];
  approach?: CaseStudyItem[];
  keyFeatures?: CaseStudyItem[];
  results?: CaseStudyItem[];
  gallery?: SanityImage[];
  testimonial?: ProjectClientTestimonial;
  liveUrl?: string;
  projectDuration?: string;
  team?: string;
  lightTheme?: ProjectColorTheme;
  darkTheme?: ProjectColorTheme;
  typography?: ProjectTypography;
};

export type ProjectColorTheme = {
  _type?: "projectColorTheme";
  primary?: string | null;
  secondary?: string | null;
  background?: string | null;
  text?: string | null;
  mutedText?: string | null;
  border?: string | null;
  surface?: string | null;
};

export type ProjectTypography = {
  _type?: "projectTypography";
  fontFamily?: string | null;
  fontWeight?: string | null;
};

export type FeaturedProject = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  technologies: string[];
  category?: string | null;
  projectType?: "mobile-app" | "web-app" | null;
  thumbnail: SanityImage | null;
  cardImage?: SanityImage | null;
};

export type CaseStudyProject = FeaturedProject & {
  description: unknown[] | null;
  featured?: boolean | null;
  industry?: string | null;
  businessType?: string | null;
  servicesProvided?: string[] | null;
  projectGoals?: CaseStudyItem[] | null;
  challenges?: CaseStudyChallenge[] | null;
  approach?: CaseStudyItem[] | null;
  keyFeatures?: CaseStudyItem[] | null;
  results?: CaseStudyItem[] | null;
  gallery?: SanityImage[] | null;
  testimonial?: ProjectClientTestimonial | null;
  liveUrl?: string | null;
  projectDuration?: string | null;
  team?: string | null;
  lightTheme?: ProjectColorTheme | null;
  darkTheme?: ProjectColorTheme | null;
  typography?: ProjectTypography | null;
};

export type Service = {
  _id: string;
  _type: "service";
  title: string;
  slug: SanitySlug;
  shortDescription: string;
  description: unknown[];
  icon: SanityImage;
};

export type HomepageService = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  icon: SanityImage | null;
};

export type ServicesPageService = HomepageService & {
  description: unknown[] | null;
};

export type Blog = {
  _id: string;
  _type: "blog";
  title: string;
  slug: SanitySlug;
  excerpt: string;
  content: unknown[];
  coverImage: SanityImage;
  author: string;
  publishedAt: string;
};

export type BlogListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  coverImage: SanityImage | null;
};

export type BlogArticle = BlogListItem & {
  content: unknown[] | null;
  category?: string | null;
};

export type Testimonial = {
  _id: string;
  _type: "testimonial";
  name: string;
  role: string;
  company: string;
  avatar?: SanityImage;
  content: string;
  rating: number;
  featured?: boolean;
};

export type FeaturedTestimonial = {
  _id: string;
  name: string;
  role: string;
  company: string;
  avatar: SanityImage | null;
  content: string;
  rating: number;
};
