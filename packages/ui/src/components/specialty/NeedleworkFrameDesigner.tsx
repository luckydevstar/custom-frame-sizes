"use client";

import { ComingSoonDesigner } from "./ComingSoonDesigner";

export interface NeedleworkFrameDesignerProps {
  defaultFrameId?: string;
  embedded?: boolean;
  hideMobileSticky?: boolean;
}

export function NeedleworkFrameDesigner(_props: NeedleworkFrameDesignerProps = {}) {
  return (
    <ComingSoonDesigner
      title="Design your needlework frame"
      description="Choose your stitching size, frame style, and mat options. Our dedicated designer will be available here soon—use the main designer in the meantime."
      buttonLabel="Design your frame"
    />
  );
}
