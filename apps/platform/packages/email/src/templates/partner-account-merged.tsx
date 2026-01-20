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

export default function CreatorAccountMerged({
  email = "panic@thedis.co",
  sourceEmail = "source@thedis.co",
  targetEmail = "target@thedis.co",
}: {
  email: string;
  sourceEmail: string;
  targetEmail: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your Cliqo creator accounts are now merged</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] px-10 py-5">
            <Section className="mb-8 flex items-center">
              <Img
                src={CLIQO_WORDMARK}
                height="32"
                alt="Cliqo"
                className="mr-auto"
              />
            </Section>

            <Heading className="p-0 text-xl font-semibold text-black">
              Your Cliqo creator accounts are now merged
            </Heading>

            <Text className="text-base text-neutral-600">
              Your account <strong>{sourceEmail}</strong>, has been successfully
              merged with <strong>{targetEmail}</strong>.
            </Text>

            <Text className="text-base text-neutral-600">
              The merged account ({sourceEmail}) has been deleted. To use Cliqo
              with that email, a new account will need to be created.
            </Text>

            <Text className="text-base text-neutral-600">
              Contact <Link href="mailto:support@cliqo.com">support</Link> if you
              have any questions.
            </Text>

            <Footer email={email} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
