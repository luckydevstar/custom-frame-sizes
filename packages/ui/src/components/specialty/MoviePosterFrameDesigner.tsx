"use client";

import { ComingSoonDesigner } from "./ComingSoonDesigner";

export interface MoviePosterFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function MoviePosterFrameDesigner(_props: MoviePosterFrameDesignerProps = {}) {
  return (
    <ComingSoonDesigner
      title="Design your movie poster frame"
      description="Choose your poster size, frame style, and mat options. Our dedicated designer will be available here soon—use the main designer in the meantime."
      buttonLabel="Design your frame"
    />
  );
}
