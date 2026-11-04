import LegalDocument from "@/components/LegalDocument";
import { getLegalDoc, legalDocs } from "@/lib/legal";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return legalDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return { title: "Policy" };
  return { title: doc.title, description: doc.summary };
}

export default async function LegalSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();
  return <LegalDocument doc={doc} />;
}
