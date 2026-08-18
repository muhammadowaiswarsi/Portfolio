import type { SchemaTypeDefinition } from "sanity";

import { blog } from "./blog";
import {
  caseStudyChallenge,
  caseStudyItem,
  projectClientTestimonial,
} from "./caseStudy";
import { project } from "./project";
import { service } from "./service";
import { testimonial } from "./testimonial";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    project,
    caseStudyItem,
    caseStudyChallenge,
    projectClientTestimonial,
    service,
    blog,
    testimonial,
  ],
};
