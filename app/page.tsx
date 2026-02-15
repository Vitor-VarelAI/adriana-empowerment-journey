import HomePage from "@/components/HomePage";
import { getSiteContent } from "./lib/sheets";

export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const cmsData = await getSiteContent();
  return <HomePage cmsData={cmsData} />;
}
