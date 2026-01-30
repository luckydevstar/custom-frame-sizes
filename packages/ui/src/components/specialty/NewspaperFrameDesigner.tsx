"use client";

import { ComingSoonDesigner } from "./ComingSoonDesigner";

export interface NewspaperFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function NewspaperFrameDesigner(_props: NewspaperFrameDesignerProps = {}) {
  return (
    <ComingSoonDesigner
      title="Design your newspaper frame"
      description="Choose your newspaper size, layout, frame style, and mat options. Our dedicated designer will be available here soon—use the main designer in the meantime."
      buttonLabel="Design your frame"
    />
  );
}
