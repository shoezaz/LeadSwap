import { CLIQO_WORDMARK, PARTNERS_DOMAIN } from "@leadswap/utils";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Footer } from "../components/footer";

export default function DomainDeleted({
  email = "panic@thedis.co",
  domain = "cliqo.com",
  workspaceSlug = "cliqo",
}: {
  email: string;
  domain: string;
  workspaceSlug: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Domain Deleted</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img src={CLIQO_WORDMARK} height="32" alt="Cliqo" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-lg font-medium text-black">
              Domain Deleted
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Your domain <code className="text-purple-600">{domain}</code> for
              your Cliqo workspace{" "}
              <Link
                href={`https://app.cliqo.com/${workspaceSlug}`}
                className="font-medium text-blue-600 no-underline"
              >
                {workspaceSlug}↗
              </Link>{" "}
              has been invalid for 30 days. As a result, it has been deleted
              from Cliqo.
            </Text>
            <Text className="text-sm leading-6 text-black">
              If you would like to restore the domain, you can easily create it
              again on Cliqo with the link below.
            </Text>
            <Section className="my-8">
              <Link
                className="rounded-lg bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`https://app.cliqo.com/${workspaceSlug}/settings/domains`}
              >
                Add a domain
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              If you don’t plan to keep using this domain on Cliqo, feel free to
              ignore this email.
            </Text>
            <Footer
              email={email}
              notificationSettingsUrl={`https://app.cliqo.com/${workspaceSlug}/settings/notifications`}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
