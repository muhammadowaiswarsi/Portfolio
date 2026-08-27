import { groq } from "next-sanity";

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true && defined(slug.current)] | order(_updatedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    technologies,
    category,
    projectType,
    thumbnail {
      _type,
      alt,
      asset
    },
    cardImage {
      _type,
      alt,
      asset
    }
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project" && defined(slug.current)] | order(_updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    technologies,
    category,
    projectType,
    thumbnail {
      _type,
      alt,
      asset
    },
    cardImage {
      _type,
      alt,
      asset
    }
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    description,
    technologies,
    featured,
    category,
    projectType,
    industry,
    businessType,
    servicesProvided,
    liveUrl,
    projectDuration,
    team,
    thumbnail {
      _type,
      alt,
      asset
    },
    cardImage {
      _type,
      alt,
      asset
    },
    projectGoals[] {
      _key,
      _type,
      title,
      description,
      image { _type, alt, asset }
    },
    challenges[] {
      _key,
      _type,
      title,
      description
    },
    approach[] {
      _key,
      _type,
      title,
      description,
      image { _type, alt, asset }
    },
    keyFeatures[] {
      _key,
      _type,
      title,
      description,
      image { _type, alt, asset }
    },
    results[] {
      _key,
      _type,
      title,
      description,
      image { _type, alt, asset }
    },
    gallery[] {
      _key,
      _type,
      alt,
      asset
    },
    testimonial {
      quote,
      name,
      role,
      company,
      rating,
      avatar { _type, alt, asset }
    },
    lightTheme {
      primary,
      secondary,
      background,
      text,
      mutedText,
      border,
      surface
    },
    darkTheme {
      primary,
      secondary,
      background,
      text,
      mutedText,
      border,
      surface
    },
    typography {
      fontFamily,
      fontWeight
    }
  }
`;

export const homepageServicesQuery = groq`
  *[_type == "service" && defined(slug.current)] | order(coalesce(order, 9999) asc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    icon {
      _type,
      alt,
      asset
    }
  }
`;

export const allServicesQuery = groq`
  *[_type == "service" && defined(slug.current)] | order(coalesce(order, 9999) asc, _createdAt asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    icon {
      _type,
      alt,
      asset
    },
    features[] {
      _key,
      title,
      description
    }
  }
`;

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    description,
    icon {
      _type,
      alt,
      asset
    },
    heroTitle,
    heroDescription,
    heroImage {
      _type,
      alt,
      asset
    },
    overview,
    benefits[] {
      _key,
      _type,
      title,
      description,
      icon { _type, alt, asset }
    },
    features[] {
      _key,
      _type,
      title,
      description,
      image { _type, alt, asset }
    },
    process[] {
      _key,
      _type,
      stepNumber,
      title,
      description
    },
    technologies,
    faqs[] {
      _key,
      _type,
      question,
      answer
    },
    gallery[] {
      _key,
      _type,
      alt,
      asset
    },
    ctaTitle,
    ctaDescription
  }
`;

export const featuredTestimonialsQuery = groq`
  *[_type == "testimonial" && featured == true] | order(_updatedAt desc) {
    _id,
    name,
    role,
    company,
    content,
    rating,
    avatar {
      _type,
      alt,
      asset
    }
  }
`;

export const allBlogsQuery = groq`
  *[_type == "blog" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    author,
    publishedAt,
    category,
    coverImage {
      _type,
      alt,
      asset
    }
  }
`;

export const blogBySlugQuery = groq`
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    author,
    publishedAt,
    category,
    content[] {
      ...,
      _type == "image" => {
        ...,
        alt,
        asset
      }
    },
    coverImage {
      _type,
      alt,
      asset
    }
  }
`;
