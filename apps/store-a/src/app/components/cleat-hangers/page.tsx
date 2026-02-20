import type { Metadata } from "next";
import { CleatHangersClient } from "./CleatHangersClient";

export const metadata: Metadata = {
  title:
    '12" Heavy-Duty Metal Cleat Bar Hanging System - Professional French Cleat Picture Hangers | Custom Frame Sizes',
  description:
    "Rock-solid French cleat hanging system for large & heavy frames. 12-inch metal cleat bars with perfect leveling, heavy-duty weight support. Trusted by galleries, frame shops & installers. Bulk pricing available.",
  keywords:
    "french cleat picture hanger, metal cleat bar, heavy duty frame hanger, 12 inch cleat hanger, large frame hanging system, professional picture hanging, gallery hanging hardware, interlocking cleat system",
};

export default function CleatHangersPage() {
  return <CleatHangersClient />;
}
