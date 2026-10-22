import { redirect } from "next/navigation";

/** Ancien lien direct vers une pratique : on l'envoie vers la page principale. */
export default async function RevenirAMoiKeyPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  redirect(`/revenir-a-moi?p=${encodeURIComponent(key)}`);
}
