import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceById, getAllServiceIds } from "@/lib/data";
import { ServiceDetailClient } from "./ServiceDetailClient";

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
    return {
      title: "Service Not Found - StreetConnect",
    };
  }

  return {
    title: `${service.name} - StreetConnect`,
    description: service.descriptionShort,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
