import type { Metadata } from "next";
import { FoamBoardClient } from "./FoamBoardClient";

export const metadata: Metadata = {
  title: "Custom-Cut Foam Board | Professional Mounting Board | Custom Frame Sizes",
  description:
    "Custom-cut foam board in white, black, and self-adhesive options. Popular sizes like 24x36, 8x10, 13x19, 11x17, and 12x18. Professional mounting boards with bulk pricing for frame shops.",
};

export default function FoamBoardPage() {
  return <FoamBoardClient />;
}
