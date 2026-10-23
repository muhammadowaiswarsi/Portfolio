type FaqJsonLdProps = {
  faqs: readonly {
    question?: string | null;
    answer?: string | null;
  }[];
};

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const entries = faqs.filter(
    (faq): faq is { question: string; answer: string } =>
      typeof faq.question === "string" &&
      faq.question.trim().length > 0 &&
      typeof faq.answer === "string" &&
      faq.answer.trim().length > 0,
  );

  if (entries.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
