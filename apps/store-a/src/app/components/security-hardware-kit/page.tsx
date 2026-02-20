import type { Metadata } from "next";
import { SecurityHardwareKitClient } from "./SecurityHardwareKitClient";

export const metadata: Metadata = {
  title:
    "Professional Security Hardware Kit for Wood Frames - Museum-Grade Anti-Theft System | Custom Frame Sizes",
  description:
    "Prevent frame theft with professional security hardware for wood frames. Museum-grade T-screws, locking brackets & tamper-resistant mounting. Trusted by galleries, hotels & commercial spaces. Bulk pricing available.",
  keywords:
    "picture frame security hardware, anti-theft frame hardware, museum grade hanging system, security T-screws, tamper proof frame mounting, gallery frame security, commercial frame hardware",
};

export default function SecurityHardwareKitPage() {
  return <SecurityHardwareKitClient />;
}
