import { CLIQO_WORDMARK } from "@leadswap/utils";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function ContactFormSubmission({
  name = "John Doe",
  email = "john@example.com",
  message = "I'm interested in working together.",
  services = ["creator campaign", "ugc"],
  budget = "$10,000 - $25,000",
}: {
  name: string;
  email: string;
  message: string;
  services: string[];
  budget?: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission from {name}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img src={CLIQO_WORDMARK} height="32" alt="Cliqo" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-lg font-medium text-black">
              New Contact Form Submission
            </Heading>

            <Text className="text-sm leading-6 text-black">
              <span className="font-semibold">Name:</span> {name}
            </Text>

            <Text className="text-sm leading-6 text-black">
              <span className="font-semibold">Email:</span> {email}
            </Text>

            {services.length > 0 && (
              <Text className="text-sm leading-6 text-black">
                <span className="font-semibold">Services:</span> {services.join(", ")}
              </Text>
            )}

            {budget && (
              <Text className="text-sm leading-6 text-black">
                <span className="font-semibold">Budget:</span> {budget}
              </Text>
            )}

            <Text className="text-sm leading-6 text-black">
              <span className="font-semibold">Message:</span>
            </Text>
            <Text className="whitespace-pre-wrap rounded bg-neutral-100 p-4 text-sm leading-6 text-black">
              {message}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
