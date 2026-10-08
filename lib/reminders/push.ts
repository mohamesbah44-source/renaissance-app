import webpush from "web-push";

export type PushPayload = { title: string; body: string; url?: string };
export type StoredSub = { id: string; endpoint: string; p256dh: string; auth: string };

let configured = false;

function configure(): boolean {
  if (configured) return true;
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:contact@example.com";
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

// Envoie une notification à chaque appareil. Renvoie le nombre d'envois réussis
// et les identifiants des abonnements expirés (à supprimer).
export async function sendToSubscriptions(
  subs: StoredSub[],
  payload: PushPayload
): Promise<{ sent: number; gone: string[] }> {
  if (!configure()) return { sent: 0, gone: [] };
  let sent = 0;
  const gone: string[] = [];
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(payload)
      );
      sent += 1;
    } catch (err) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) gone.push(s.id);
    }
  }
  return { sent, gone };
}
