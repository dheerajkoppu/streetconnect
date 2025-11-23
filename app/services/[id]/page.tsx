import { Metadata } from "next";
import { getServiceById, getAllServiceIds } from "@/lib/data";
import { DynamicServiceLoader } from "./DynamicServiceLoader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = getAllServiceIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    // For dynamic OSM services, we can't generate metadata at build time
    // but we provide a generic title
    return {
      title: "Service Details - StreetConnect",
      description: "View service details and get directions",
    };
  }

  return {
    title: `${service.name} - StreetConnect`,
    description: service.descriptionShort,
  };
}

// Enable dynamic rendering for OSM services
export const dynamicParams = true;

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Try to get static service first
  const staticService = getServiceById(id) || null;

  // Use the dynamic loader to handle both static and OSM services
  return <DynamicServiceLoader serviceId={id} staticService={staticService} />;
}
