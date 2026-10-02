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
    name: "Upwork Client",
    role: "Enterprise Client",
    company: "Multi-tenant SaaS",
    avatar: null,
    rating: 5,
    content: clip(
      "Owais and his team have been helping us with a large enterprise level multi-tenant SAAS platform. It is MERN stack with graphQL microservices based application hosted on AWS. Owais has extra-ordinary skills in this domain. There is nothing he can't resolve or come up with a solution for. He has deep understanding of AWS devops. He is very kind and has excellent communication skills and is just a phone call away. He works according to US time which makes it easy to conduct meetings with him. I wholeheartedly recommend him.",
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
      "Owais is an exceptional Upwork developer! His professionalism, attention to detail, and coding skills were outstanding. Communication was smooth, deadlines were met, and they offered innovative solutions to challenges. Highly recommended! Thank you for your dedication!",
    ),
  },
  {
    _id: "upwork-fullstack-rn",
    name: "Upwork Client",
    role: "Client",
    company: "Node.js & React Native",
    avatar: null,
    rating: 5,
    content: clip(
      "I had the privilege of collaborating with Muhammad Owais on my project, and I must say, his work was truly outstanding. As a freelancer specializing in Node.js and React Native, he showcased an exceptional level of expertise and professionalism. From the very beginning, Muhammad impressed me with his in-depth understanding of the technologies involved. His communication skills were excellent. Muhammad's technical prowess and attention to detail were evident in the quality of his work. He delivered a robust and seamlessly functioning solution that exceeded my expectations. I highly recommend him to anyone seeking top-tier Node.js and React Native expertise.",
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
      "Working with Muhammad was a great experience. The work delivered met all technical requirements. He was always available for us, and very cooperative. After the first round of testing the project, we had very short feedback cycles where we could adjust some smaller things here and there. He and his team were always available on short notice to jump into a quick call to discuss some details.",
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
      "Owais jumped in and helped us out of a nightmare codebase that we were left with by another agency that couldn't finish the job — it was honestly a mess, and that didn't stop him from getting in and helping us get it up and running! He's really great at communication, reliable, and we had a great experience working with him. Will definitely hire him again!",
    ),
  },
  {
    _id: "upwork-carousel-repeat",
    name: "Upwork Client",
    role: "Returning Client",
    company: "Web App UI",
    avatar: null,
    rating: 5,
    content: clip(
      "This is our second project working together with Muhammad — we are very pleased with our collaboration. As with our previous project, communication and availability were extraordinary. He and his team were always available to jump into a call with us. We are happy with the outcome and the quality of work delivered! We are looking forward to working again with Muhammad.",
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
