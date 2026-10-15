import type { FeaturedTestimonial } from "@/types/sanity";

function clip(value: string, max = 500) {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Curated public Upwork client feedback for Computing Yard homepage.
 * Source: https://www.upwork.com/freelancers/~0165f6ee97dbbb2d22
 * Prefer substantive 5★ reviews; skip empty/ultra-short and low ratings.
 */
export const UPWORK_FEATURED_TESTIMONIALS: FeaturedTestimonial[] = [
  {
    _id: "upwork-bewta-saas",
    name: "Client",
    role: "Enterprise Client",
    company: "Multi-tenant SaaS",
    avatar: null,
    rating: 5,
    content: clip(
      "CY and the team have been helping us with a large enterprise level multi-tenant SAAS platform. It is MERN stack with graphQL microservices based application hosted on AWS. CY has extra-ordinary skills in this domain. There is nothing they can't resolve or come up with a solution for. They have a deep understanding of AWS devops. They are very kind and have excellent communication skills and are just a phone call away. They work according to US time which makes it easy to conduct meetings with them. I wholeheartedly recommend them.",
    ),
  },
  {
    _id: "upwork-andrei-t",
    name: "Andrei T.",
    role: "Client",
    company: "React Frontend",
    avatar: null,
    rating: 5,
    content: clip(
      "CY is an exceptional developer! Their professionalism, attention to detail, and coding skills were outstanding. Communication was smooth, deadlines were met, and they offered innovative solutions to challenges. Highly recommended! Thank you for your dedication!",
    ),
  },
  {
    _id: "upwork-fullstack-rn",
    name: "Client",
    role: "Client",
    company: "Node.js & React Native",
    avatar: null,
    rating: 5,
    content: clip(
      "I had the privilege of collaborating with CY on my project, and I must say, the work was truly outstanding. As a team specializing in Node.js and React Native, they showcased an exceptional level of expertise and professionalism. From the very beginning, CY impressed me with an in-depth understanding of the technologies involved. Their communication skills were excellent. CY's technical prowess and attention to detail were evident in the quality of the work. They delivered a robust and seamlessly functioning solution that exceeded my expectations. I highly recommend them to anyone seeking top-tier Node.js and React Native expertise.",
    ),
  },
  {
    _id: "upwork-dominik-b",
    name: "Dominik B.",
    role: "Client",
    company: "React Native",
    avatar: null,
    rating: 5,
    content: clip(
      "Working with CY was a great experience. The work delivered met all technical requirements. They were always available for us, and very cooperative. After the first round of testing the project, we had very short feedback cycles where we could adjust some smaller things here and there. CY and the team were always available on short notice to jump into a quick call to discuss some details.",
    ),
  },
  {
    _id: "upwork-nate-e",
    name: "Nate E.",
    role: "Client",
    company: "Serverless / GraphQL",
    avatar: null,
    rating: 5,
    content: clip(
      "CY jumped in and helped us out of a nightmare codebase that we were left with by another agency that couldn't finish the job — it was honestly a mess, and that didn't stop them from getting in and helping us get it up and running! They're really great at communication, reliable, and we had a great experience working with them. Will definitely hire them again!",
    ),
  },
  {
    _id: "upwork-carousel-repeat",
    name: "Client",
    role: "Returning Client",
    company: "Web App UI",
    avatar: null,
    rating: 5,
    content: clip(
      "This is our second project working together with CY — we are very pleased with our collaboration. As with our previous project, communication and availability were extraordinary. CY and the team were always available to jump into a call with us. We are happy with the outcome and the quality of work delivered! We are looking forward to working again with CY.",
    ),
  },
];

export function isDemoTestimonial(testimonial: FeaturedTestimonial) {
  return (
    testimonial._id.includes("demo") ||
    /\(Demo\)/i.test(testimonial.name) ||
    /placeholder|fictional|demo quote|sample testimonial|temporary placeholder/i.test(
      testimonial.content,
    )
  );
}
