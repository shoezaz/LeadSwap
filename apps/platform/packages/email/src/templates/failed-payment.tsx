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
import { WorkspaceProps } from "../types";

export default function FailedPayment({
  user = { name: "Brendon Urie", email: "panic@thedis.co" },
  workspace = { name: "Cliqo", slug: "cliqo" },
  amountDue = 2400,
  attemptCount = 2,
}: {
  user: { name?: string | null; email: string };
  workspace: Pick<WorkspaceProps, "name" | "slug">;
  amountDue: number;
  attemptCount: number;
}) {
  const title = `${
    attemptCount == 2 ? "2nd notice: " : attemptCount == 3 ? "3rd notice: " : ""
  }Your payment for Cliqo failed`;

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img src={CLIQO_WORDMARK} height="32" alt="Cliqo" />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-lg font-medium text-black">
              {attemptCount == 2 ? "2nd " : attemptCount == 3 ? "3rd  " : ""}
              Failed Payment for Cliqo
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Hey{user.name ? `, ${user.name}` : ""}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Your payment of{" "}
              <code className="text-purple-600">${amountDue / 100}</code> for
              your Cliqo workspace{" "}
              <code className="text-purple-600">{workspace.name}</code> has
              failed. Please{" "}
              <Link
                href="https://cliqo.com/help/article/how-to-change-billing-information"
                className="font-medium text-blue-600 no-underline"
              >
                update your payment information
              </Link>{" "}
              using the link below:
            </Text>
            <Section className="my-8">
              <Link
                className="rounded-lg bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={`https://app.cliqo.com/${workspace.slug}/settings/billing`}
              >
                Update payment information
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              If you have any questions, feel free to respond to this email –
              we're happy to help!
            </Text>
            <Footer email={user.email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
