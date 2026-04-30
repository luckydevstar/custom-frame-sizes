import type { Metadata } from "next";

import ResourcesHubContent from "@/components/resources/resources-hub-content";
import { resourcesHubMetadata } from "@/lib/resources-metadata";

export const metadata: Metadata = resourcesHubMetadata;

export default function ResourcesPage() {
  return <ResourcesHubContent />;
}
