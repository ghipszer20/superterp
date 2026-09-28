import type { ReactNode } from "react";
import { Card, EmptyState, Page, Section } from "./ui";

export function ComingSoon({ title, headline, children }: { title: string; headline: string; children: ReactNode }) {
  return (
    <Page title={title}>
      <Section>
        <Card>
          <EmptyState title={headline}>{children}</EmptyState>
        </Card>
      </Section>
    </Page>
  );
}
