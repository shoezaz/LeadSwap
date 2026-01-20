import { APP_DOMAIN, CLIQO_WORDMARK } from "@leadswap/utils";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Footer } from "../components/footer";

export default function UnresolvedFraudEventsSummary({
  email = "panic@thedis.co",
  workspace = { slug: "acme" },
  program = { name: "Acme", slug: "acme" },
  fraudGroups = [
    {
      id: "fg_1",
      name: "Suspicious payout method",
      count: 3,
      partner: {
        id: "p_1",
        name: "Jane Doe",
        image: null,
      },
    },
  ],
}: {
  email: string;
  workspace: { slug: string };
  program: { name: string; slug: string };
  fraudGroups: Array<{
    id: string;
    name: string;
    count: number;
    partner: { id: string; name: string; image: string | null };
  }>;
}) {
  const reviewUrl = `${APP_DOMAIN}/${workspace.slug}/campaigns/fraud`;
  const notificationSettingsUrl = `${APP_DOMAIN}/${workspace.slug}/settings/notifications`;

  return (
      <Html>
      <Head />
      <Preview>{`Fraud events pending review for ${program.name} (${fraudGroups.length} alerts)`}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[600px] rounded border border-solid border-neutral-200 px-10 py-5">
            <Section className="mt-8">
              <Img src={CLIQO_WORDMARK} height="32" alt="Cliqo" />
            </Section>

            <Heading className="mx-0 my-7 p-0 text-lg font-medium text-black">
              Fraud events pending review for {program.name}
            </Heading>

            <Text className="text-sm leading-6 text-neutral-700">
              We flagged suspicious activity in your partner program. Review
              these alerts to confirm fraud or mark them as safe.
            </Text>

            <Section className="mt-6">
              <Row className="pb-2">
                <Column align="left" className="text-sm text-neutral-500">
                  Alert
                </Column>
                <Column align="right" className="text-sm text-neutral-500">
                  Events
                </Column>
              </Row>

              {fraudGroups.map(({ id, name, count, partner }, index) => (
                <div key={id}>
                  <Row className="py-2">
                    <Column align="left">
                      <div className="flex items-center gap-2">
                        {partner.image ? (
                          <Img
                            src={partner.image}
                            width="20"
                            height="20"
                            alt={partner.name}
                            className="rounded-full"
                          />
                        ) : null}
                        <span className="text-sm font-medium text-black">
                          {name}
                        </span>
                        <span className="text-xs text-neutral-500">
                          · {partner.name}
                        </span>
                      </div>
                    </Column>
                    <Column align="right" className="text-sm text-neutral-700">
                      {count}
                    </Column>
                  </Row>
                  {index !== fraudGroups.length - 1 && (
                    <Hr className="my-1 w-full border border-neutral-200" />
                  )}
                </div>
              ))}
            </Section>

            <Section className="my-8">
              <Link
                className="rounded-lg bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={reviewUrl}
              >
                Review fraud alerts
              </Link>
            </Section>

            <Footer
              email={email}
              notificationSettingsUrl={notificationSettingsUrl}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
