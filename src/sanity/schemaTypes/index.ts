import type { SchemaTypeDefinition } from "sanity";

import { blog } from "./blog";
import {
  caseStudyChallenge,
  caseStudyItem,
  projectClientTestimonial,
} from "./caseStudy";
import { project } from "./project";
import { projectColorTheme, projectTypography } from "./projectTheme";
import { service, serviceBenefit, serviceFaq, serviceFeature, serviceProcessStep } from "./service";
import { testimonial } from "./testimonial";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    project,
    projectColorTheme,
    projectTypography,
    caseStudyItem,
    caseStudyChallenge,
    projectClientTestimonial,
    service,
    serviceBenefit,
    serviceFeature,
    serviceProcessStep,
    serviceFaq,
    blog,
    testimonial,
  ],
};
