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
import { ReactNode } from "react";
import { Footer } from "../components/footer";

export default function CreatorApplicationApproved({
  program = {
    name: "Acme",
    logo: CLIQO_WORDMARK,
    slug: "acme",
  },
  creator = {
    name: "John Doe",
    email: "panic@thedis.co",
    payoutsEnabled: false,
  },
  rewardDescription = "Earn 30% for each sale for 12 months.",
}: {
  program: {
    name: string;
    logo: string | null;
    slug: string;
  };
  creator: {
    name: string;
    email: string;
    payoutsEnabled: boolean;
  };
  rewardDescription: ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>
        Your application to join {program.name}'s creator program has been
        approved!
      </Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src={program.logo || "/assets/logo.png"}
                height="32"
                alt={program.name}
              />
            </Section>

            <Heading className="mx-0 my-7 p-0 text-lg font-medium text-black">
              Congratulations, {creator.name}!
            </Heading>

            <Text className="text-sm leading-6 text-neutral-600">
              Your application to join <strong>{program.name}'s</strong> creator
              program has been approved. You can now start promoting their
              products and earning commissions.
            </Text>

            <Text className="text-sm leading-6 text-neutral-900">
              {rewardDescription}
            </Text>

            <Hr className="my-6 border-neutral-200" />

            <Heading className="mx-0 mb-2 p-0 text-base font-medium text-black">
              Getting Started
            </Heading>

            <Text className="ml-1 text-sm leading-5 text-black">
              1. Find your unique referral links in the{" "}
              <Link
                href={`${PARTNERS_DOMAIN}/programs/${program.slug}/links`}
                className="font-semibold text-black underline"
              >
                Links
              </Link>{" "}
              section.
            </Text>

            <Text className="ml-1 text-sm leading-5 text-black">
              2. Share your referral links on your website, blog, social media,
              or email newsletters.
            </Text>

            <Text className="ml-1 text-sm leading-5 text-black">
              3. Track your{" "}
              <Link
                href={`${PARTNERS_DOMAIN}/programs/${program.slug}`}
                className="font-semibold text-black underline"
              >
                link performance
              </Link>{" "}
              and{" "}
              <Link
                href={`${PARTNERS_DOMAIN}/programs/${program.slug}/earnings`}
                className="font-semibold text-black underline"
              >
                earnings
              </Link>{" "}
              in real-time.
            </Text>

            <Text className="ml-1 text-sm leading-5 text-black">
              4. Learn how to{" "}
              <Link
                href="https://cliqo.com/help/article/navigating-creator-program"
                className="font-semibold text-black underline"
              >
                navigate the program dashboard
              </Link>{" "}
              and get the most out of your program.
            </Text>

            {!creator.payoutsEnabled && (
              <Text className="ml-1 text-sm leading-5 text-black">
                5. Connect your Stripe account to{" "}
                <Link
                  href="https://cliqo.com/help/article/receiving-payouts"
                  className="font-semibold text-black underline"
                >
                  enable payouts
                </Link>
                .
              </Text>
            )}

            <Hr className="my-6 border-neutral-200" />

            <Section className="mb-8 mt-8">
              <Link
                className="rounded-lg bg-neutral-900 px-6 py-3 text-[13px] font-semibold text-white no-underline"
                href={`${PARTNERS_DOMAIN}/programs/${program.slug}`}
              >
                Go to your dashboard
              </Link>
            </Section>

            <Text className="text-sm leading-6 text-neutral-600">
              If you have any questions about the program please don't hesitate
              to{" "}
              <Link
                href={`${PARTNERS_DOMAIN}/messages/${program.slug}`}
                className="font-semibold text-neutral-700 underline underline-offset-2"
              >
                reach out to the {program.name} team ↗
              </Link>
              .
            </Text>

            <Text className="text-sm leading-6 text-neutral-600">
              We're excited to have you as a creator and look forward to your
              success!
            </Text>

            <Footer
              email={creator.email}
              notificationSettingsUrl="${PARTNERS_DOMAIN}/settings/notifications"
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
