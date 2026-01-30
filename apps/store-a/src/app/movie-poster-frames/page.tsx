import type { Metadata } from "next";
import { ComingSoonPlaceholder } from "../../components/ComingSoonPlaceholder";

export const metadata: Metadata = {
  title: "Movie Poster Frames | Onesheet & Poster Display | CustomFrameSizes.com",
  description: "Custom frames for movie posters and onesheets. Coming soon.",
};

export default function MoviePosterFramesPage() {
  return (
    <ComingSoonPlaceholder
      title="Movie Poster Frames"
      description="Custom frames for movie posters and onesheets. This page is under construction."
    />
  );
}
