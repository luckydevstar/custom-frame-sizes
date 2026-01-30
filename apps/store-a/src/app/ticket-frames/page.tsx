import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Ticket Frames | Ticket Stub Display | CustomFrameSizes.com",
  description: "Custom frames for ticket stubs and event memorabilia. Coming soon.",
};

export default function TicketFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Ticket Frames"
      description="Custom frames for ticket stubs and event memorabilia. This page is under construction."
    />
  );
}
