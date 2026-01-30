import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Wedding Invitation Frames | Custom Invitation Display | CustomFrameSizes.com",
  description: "Custom frames for wedding invitations and save-the-dates. Coming soon.",
};

export default function WeddingInvitationFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Wedding Invitation Frames"
      description="Custom frames for wedding invitations and save-the-dates. This page is under construction."
    />
  );
}
