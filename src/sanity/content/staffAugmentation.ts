import type {
  HomepageService,
  ServiceLanding,
  ServicesPageService,
} from "@/types/sanity";

export const STAFF_AUGMENTATION_SLUG = "staff-augmentation";
export const STAFF_AUGMENTATION_ID = "service-staff-augmentation";

type Paragraph = {
  key: string;
  text: string;
};

function blocks(paragraphs: Paragraph[]) {
  return paragraphs.map((paragraph) => ({
    _type: "block",
    _key: paragraph.key,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `${paragraph.key}-span`,
        text: paragraph.text,
        marks: [],
      },
    ],
  }));
}

const overview = blocks([
  {
    key: "overview-1",
    text: "Staff augmentation is a way to extend an in-house team with outside technology professionals for a specific skill, project, or period of time. The people you add work with your existing team instead of taking the product away as a separate delivery.",
  },
  {
    key: "overview-2",
    text: "Computing Yard offers both options. An individual developer can join the team you already have, or a dedicated team of several professionals can focus on your project together. In either case you keep direction of priorities, tools, and collaboration.",
  },
]);

const description = blocks([
  {
    key: "description-1",
    text: "Extend your work with an individual developer inside your team, or with a dedicated group of professionals for a project. You stay in control of priorities while they collaborate with your people.",
  },
]);

export const staffAugmentationLanding: ServiceLanding = {
  _id: STAFF_AUGMENTATION_ID,
  title: "Staff Augmentation",
  slug: STAFF_AUGMENTATION_SLUG,
  shortDescription:
    "Add an individual developer to your team, or a dedicated group of professionals for a project, for the skills and duration the work needs.",
  description,
  icon: null,
  heroTitle: "Scale Your Team with Skilled IT Professionals",
  heroDescription:
    "Add one developer to the team you already have, or bring in a dedicated group for a project, for the skills and time the work needs.",
  overview,
  engagementsTitle: "Individual Developers or a Dedicated Team",
  engagements: [
    {
      _key: "engagement-individual",
      _type: "serviceBenefit",
      title: "Individual Developers",
      description:
        "One professional joins your existing team, tools, and day-to-day workflow. Choose this when you need a specific skill or extra capacity on a product your people already run. You direct their work the same way you direct your own team.",
    },
    {
      _key: "engagement-dedicated",
      _type: "serviceBenefit",
      title: "Dedicated Teams",
      description:
        "Several professionals, such as developers together with a designer or tester, focus on your project as a group. Choose this when the work needs more than one role, or when you want a coordinated group rather than a single addition to your staff. You still set the priorities.",
    },
  ],
  featuresTitle: "Talent We Provide",
  features: [
    {
      _key: "talent-frontend",
      _type: "serviceFeature",
      title: "Frontend Developers",
      description:
        "Developers who can work in React, Next.js, and Angular inside the frontend your team already uses.",
    },
    {
      _key: "talent-backend",
      _type: "serviceFeature",
      title: "Backend Developers",
      description:
        "Engineers for Node.js, Python, PHP, and Laravel who can contribute to APIs, services, and server-side work.",
    },
    {
      _key: "talent-fullstack",
      _type: "serviceFeature",
      title: "Full-Stack Developers",
      description:
        "Developers who can contribute across the interface and the backend when a role needs both.",
    },
    {
      _key: "talent-mobile",
      _type: "serviceFeature",
      title: "Mobile App Developers",
      description:
        "Developers for iOS and Android products, including React Native when that matches your stack.",
    },
    {
      _key: "talent-design",
      _type: "serviceFeature",
      title: "UI/UX Designers",
      description:
        "Designers who can shape flows, interfaces, and product visuals with your product team.",
    },
    {
      _key: "talent-qa",
      _type: "serviceFeature",
      title: "QA and Test Engineers",
      description:
        "Testers who help check releases, regressions, and the quality of new work before it ships.",
    },
    {
      _key: "talent-devops",
      _type: "serviceFeature",
      title: "DevOps Engineers",
      description:
        "Engineers who can support deployment, environments, and the delivery pipeline you already run.",
    },
  ],
  benefitsTitle: "Benefits of Staff Augmentation",
  benefits: [
    {
      _key: "benefit-scale",
      _type: "serviceBenefit",
      title: "Flexible team scaling",
      description:
        "Add capacity for a busy phase and reduce it when the workload changes, instead of locking in a fixed headcount.",
    },
    {
      _key: "benefit-skills",
      _type: "serviceBenefit",
      title: "Specialized technical skills",
      description:
        "Bring in experience for a specific stack or problem without hiring a permanent role for every skill.",
    },
    {
      _key: "benefit-hiring",
      _type: "serviceBenefit",
      title: "Faster than a permanent hire",
      description:
        "Skip a full-time recruitment cycle and start with professionals who can join your existing workflow.",
    },
    {
      _key: "benefit-team",
      _type: "serviceBenefit",
      title: "Works with your existing team",
      description:
        "An individual developer works inside your team. A dedicated team also follows your tools, communication, and priorities while coordinating as a group.",
    },
    {
      _key: "benefit-control",
      _type: "serviceBenefit",
      title: "You keep control of priorities",
      description:
        "You decide the backlog, the direction, and how time is spent. The added people follow your priorities.",
    },
    {
      _key: "benefit-engagement",
      _type: "serviceBenefit",
      title: "Engagement sized to the project",
      description:
        "Ask for support for a phase, a release, or a longer period, based on what the work actually needs.",
    },
  ],
  processTitle: "How It Works",
  process: [
    {
      _key: "step-1",
      _type: "serviceProcessStep",
      stepNumber: 1,
      title: "Share Your Requirements",
      description:
        "Tell us whether you need an individual developer or a dedicated team, plus the roles, skills, and how long you expect to need support.",
    },
    {
      _key: "step-2",
      _type: "serviceProcessStep",
      stepNumber: 2,
      title: "Match the Required Skills",
      description:
        "We look for professionals whose experience fits the stack and the kind of work you described.",
    },
    {
      _key: "step-3",
      _type: "serviceProcessStep",
      stepNumber: 3,
      title: "Review and Interview Candidates",
      description:
        "You review profiles and interview the people you may want on the team before anyone joins.",
    },
    {
      _key: "step-4",
      _type: "serviceProcessStep",
      stepNumber: 4,
      title: "Onboard the Selected Professionals",
      description:
        "Selected professionals join your tools, communication, and ways of working.",
    },
    {
      _key: "step-5",
      _type: "serviceProcessStep",
      stepNumber: 5,
      title: "Collaborate and Scale as Needed",
      description:
        "Work together on your priorities, and adjust the team if the project changes.",
    },
  ],
  highlightsTitle: "Why Choose Computing Yard",
  highlights: [
    {
      _key: "highlight-expertise",
      _type: "serviceBenefit",
      title: "Technical depth",
      description:
        "People who are used to production software, across web, mobile, backend, design, testing, and delivery.",
    },
    {
      _key: "highlight-communication",
      _type: "serviceBenefit",
      title: "Straightforward communication",
      description:
        "Clear updates and direct collaboration, so your team is not left guessing about progress.",
    },
    {
      _key: "highlight-collaboration",
      _type: "serviceBenefit",
      title: "Built to collaborate",
      description:
        "Individual developers join your process. A dedicated team works with your people too, while coordinating with each other on the project.",
    },
    {
      _key: "highlight-flexible",
      _type: "serviceBenefit",
      title: "Engagement you can adjust",
      description:
        "Start with the roles you need now and change the mix as the work evolves.",
    },
  ],
  faqs: [
    {
      _key: "faq-what",
      _type: "serviceFaq",
      question: "What is IT staff augmentation?",
      answer:
        "IT staff augmentation means adding external technology professionals to your existing team for a defined need. They work with your people on your project, rather than taking the whole product away to deliver separately.",
    },
    {
      _key: "faq-outsourcing",
      _type: "serviceFaq",
      question: "How is staff augmentation different from outsourcing?",
      answer:
        "With outsourcing, a vendor usually owns delivery of a defined piece of work. With staff augmentation, you keep control of priorities and day-to-day direction, and the added professionals work as part of your team.",
    },
    {
      _key: "faq-options",
      _type: "serviceFaq",
      question: "Should we request one developer or a dedicated team?",
      answer:
        "Request an individual developer when one skill needs to sit inside the team you already have. Request a dedicated team when the project needs several roles working together. We do not decide that for you; we discuss the shape of the work and which option fits.",
    },
    {
      _key: "faq-roles",
      _type: "serviceFaq",
      question: "Which technical roles can we request?",
      answer:
        "You can request frontend, backend, and full-stack developers, mobile app developers, UI/UX designers, QA and test engineers, and DevOps engineers. These are staffing capabilities, not a promise that a specific person is available on a given date.",
    },
    {
      _key: "faq-team",
      _type: "serviceFaq",
      question: "Can augmented developers work with our existing team?",
      answer:
        "Yes. An individual developer joins your communication, tools, and workflow. A dedicated team also works with your people and follows your priorities, while collaborating as a group on the project.",
    },
    {
      _key: "faq-duration",
      _type: "serviceFaq",
      question: "Can we request short-term or long-term support?",
      answer:
        "Yes. An engagement can cover a short phase or a longer period, based on the project. There is no single required duration.",
    },
    {
      _key: "faq-start",
      _type: "serviceFaq",
      question: "How do we get started?",
      answer:
        "Share the roles and skills you need through the contact form, or talk with our team. We review the requirements with you and discuss possible matches.",
    },
  ],
  primaryCtaLabel: "Hire Developers",
  secondaryCtaLabel: "Talk to Our Team",
  ctaTitle: "Ready to Extend Your Development Team?",
  ctaDescription:
    "Tell us the roles, skills, and timeline you have in mind. We will discuss how staff augmentation can fit your team.",
  ctaButtonLabel: "Discuss Your Requirements",
  seoTitle: "Staff Augmentation Services",
  seoDescription:
    "Extend your team with skilled software developers and technology professionals through Computing Yard's flexible staff augmentation services.",
};

export const staffAugmentationListing: ServicesPageService = {
  _id: staffAugmentationLanding._id,
  title: staffAugmentationLanding.title,
  slug: staffAugmentationLanding.slug,
  shortDescription: staffAugmentationLanding.shortDescription,
  icon: null,
  features: staffAugmentationLanding.features?.map((feature) => ({
    _key: feature._key,
    title: feature.title,
    description: feature.description,
  })),
};

export const staffAugmentationHomepage: HomepageService = {
  _id: staffAugmentationLanding._id,
  title: staffAugmentationLanding.title,
  slug: staffAugmentationLanding.slug,
  shortDescription: staffAugmentationLanding.shortDescription,
  icon: null,
};

export function staffAugmentationDocument() {
  return {
    _id: STAFF_AUGMENTATION_ID,
    _type: "service" as const,
    title: staffAugmentationLanding.title,
    slug: { _type: "slug" as const, current: STAFF_AUGMENTATION_SLUG },
    shortDescription: staffAugmentationLanding.shortDescription,
    description: staffAugmentationLanding.description,
    featured: false,
    order: 70,
    heroTitle: staffAugmentationLanding.heroTitle,
    heroDescription: staffAugmentationLanding.heroDescription,
    overview: staffAugmentationLanding.overview,
    featuresTitle: staffAugmentationLanding.featuresTitle,
    features: staffAugmentationLanding.features,
    benefitsTitle: staffAugmentationLanding.benefitsTitle,
    benefits: staffAugmentationLanding.benefits,
    processTitle: staffAugmentationLanding.processTitle,
    process: staffAugmentationLanding.process,
    engagementsTitle: staffAugmentationLanding.engagementsTitle,
    engagements: staffAugmentationLanding.engagements,
    highlightsTitle: staffAugmentationLanding.highlightsTitle,
    highlights: staffAugmentationLanding.highlights,
    faqs: staffAugmentationLanding.faqs,
    primaryCtaLabel: staffAugmentationLanding.primaryCtaLabel,
    secondaryCtaLabel: staffAugmentationLanding.secondaryCtaLabel,
    ctaTitle: staffAugmentationLanding.ctaTitle,
    ctaDescription: staffAugmentationLanding.ctaDescription,
    ctaButtonLabel: staffAugmentationLanding.ctaButtonLabel,
    seoTitle: staffAugmentationLanding.seoTitle,
    seoDescription: staffAugmentationLanding.seoDescription,
  };
}
