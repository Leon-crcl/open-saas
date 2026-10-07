import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../client/components/ui/accordion";
import { Section } from "./Section";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  href?: string;
}

export function FAQ({ faqs }: { faqs: FAQ[] }) {
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
        <div>
          <h2 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-7">
            Can&apos;t find what you&apos;re looking for? Our team is happy to
            help.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
              <AccordionTrigger className="text-foreground py-5 text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-7">
                <p>{faq.answer}</p>
                {faq.href && (
                  <a
                    href={faq.href}
                    className="text-brand mt-3 inline-block font-medium hover:underline"
                  >
                    Learn more →
                  </a>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
