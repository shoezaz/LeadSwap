import { CLIQO_WORDMARK, PARTNERS_DOMAIN } from "@leadswap/utils";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Footer } from "../components/footer";

export default function WelcomeEmail({
  name = "Brendon Urie",
  email = "panic@thedis.co",
}: {
  name: string | null;
  email: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Cliqo</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img src={CLIQO_WORDMARK} height="32" alt="Cliqo" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-xl font-semibold text-black">
              Welcome {name || "to Cliqo"}!
            </Heading>
            <Text className="mb-8 text-sm leading-6 text-gray-600">
              Thank you for signing up for Cliqo! You can now start creating UGC
              campaigns, collaborate with creators, and track your performance.
            </Text>

            <Hr />

            <Heading className="mx-0 my-6 p-0 text-lg font-semibold text-black">
              Getting started
            </Heading>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">
                1. Set up your workspace
              </strong>
              :{" "}
              <Link
                href="https://cliqo.com/help/article/how-to-add-custom-domain"
                className="font-semibold text-black underline underline-offset-4"
              >
                Configure your workspace
              </Link>{" "}
              and start launching your UGC campaigns.
            </Text>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">
                2. Launch a campaign
              </strong>
              : Create your first{" "}
              <Link
                href="https://cliqo.com/help/article/cliqo-analytics"
                className="font-semibold text-black underline underline-offset-4"
              >
                UGC campaign
              </Link>{" "}
              and invite creators to participate.
            </Text>

            <Text className="mb-4 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">
                3. Collaborate with creators
              </strong>
              : Manage your creators and{" "}
              <Link
                href="https://cliqo.com/help/article/cliqo-conversions"
                className="font-semibold text-black underline underline-offset-4"
              >
                track their content performance
              </Link>
              .
            </Text>

            <Text className="mb-8 text-sm leading-6 text-gray-600">
              <strong className="font-medium text-black">
                4. Track performance
              </strong>
              :{" "}
              <Link
                href="https://cliqo.com/docs/introduction"
                className="font-semibold text-black underline underline-offset-4"
              >
                Monitor your campaigns
              </Link>{" "}
              with real-time analytics.
            </Text>

            <Section className="mb-8">
              <Link
                className="rounded-lg bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href="https://app.cliqo.com"
              >
                Go to your dashboard
              </Link>
            </Section>

            <Footer email={email} marketing />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
