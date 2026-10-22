"use client";

import { useEffect, useState, useTransition } from "react";
import { savePushSubscription, removePushSubscription, sendTestPush } from "@/lib/reminders/actions";

type Status = "loading" | "unsupported" | "ios-install" | "denied" | "off" | "on";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function ReminderSwitch() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    async function init() {
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true;
      if (isIOS && !standalone) {
        setStatus("ios-install");
        return;
      }
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        setStatus("unsupported");
        return;
      }
      if (Notification.permission === "denied") {
        setStatus("denied");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        setStatus(sub && Notification.permission === "granted" ? "on" : "off");
      } catch {
        setStatus("unsupported");
      }
    }
    void init();
  }, []);

  async function enable() {
    setMessage(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) {
        setMessage("Les rappels ne sont pas encore configurés côté serveur.");
        return;
      }
      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(key) as unknown as BufferSource,
        }));
      const json = sub.toJSON();
      const res = await savePushSubscription({
        endpoint: sub.endpoint,
        p256dh: json.keys?.p256dh ?? "",
        auth: json.keys?.auth ?? "",
      });
      if (res.ok) {
        setStatus("on");
      } else {
        setMessage("Impossible d'enregistrer cet appareil. Réessaie dans un instant.");
      }
    } catch {
      setMessage("Impossible d'activer les rappels sur cet appareil.");
    }
  }

  async function disable() {
    setMessage(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await removePushSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch {
      setMessage("Impossible de désactiver pour le moment.");
    }
  }

  function test() {
    setMessage(null);
    startTransition(async () => {
      const res = await sendTestPush();
      setMessage(res.message);
    });
  }

  const primary =
    "h-12 w-full rounded-full bg-rr-or text-[15px] font-medium text-rr-noir transition-opacity duration-300 hover:opacity-90 disabled:opacity-50";
  const secondary =
    "h-12 w-full rounded-full border border-rr-or/40 text-sm text-rr-or transition-colors hover:bg-rr-or/10 disabled:opacity-50";

  return (
    <div className="flex flex-col gap-4">
      {status === "loading" && <p className="text-sm text-rr-gris-clair">Un instant…</p>}

      {status === "ios-install" && (
        <p className="text-sm leading-relaxed text-rr-gris-clair">
          Sur iPhone, ajoute d&apos;abord l&apos;appli à ton écran d&apos;accueil : dans Safari, touche le bouton de partage,
          puis « Sur l&apos;écran d&apos;accueil ». Ouvre-la depuis l&apos;icône, et reviens ici pour activer les rappels.
        </p>
      )}

      {status === "unsupported" && (
        <p className="text-sm leading-relaxed text-rr-gris-clair">
          Cet appareil ou ce navigateur ne permet pas les notifications.
        </p>
      )}

      {status === "denied" && (
        <p className="text-sm leading-relaxed text-rr-gris-clair">
          Les notifications sont bloquées pour ce site. Autorise-les dans les réglages de ton navigateur, puis recharge la page.
        </p>
      )}

      {status === "off" && (
        <>
          <div>
            <p className="font-rr-serif text-[22px] italic leading-tight text-rr-ivoire">Notifications</p>
            <p className="mt-1 text-xs text-rr-gris-clair">Désactivées sur cet appareil</p>
          </div>
          <button type="button" onClick={enable} className={primary}>
            Activer sur cet appareil
          </button>
        </>
      )}

      {status === "on" && (
        <>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-rr-serif text-[22px] italic leading-tight text-rr-ivoire">Notifications</p>
              <p className="mt-1 text-xs text-rr-gris-clair">Activées sur cet appareil</p>
            </div>
            <span
              role="img"
              aria-label="Activées"
              className="relative h-[30px] w-[50px] shrink-0 rounded-full bg-rr-or"
            >
              <span className="absolute left-[23px] top-[3px] h-6 w-6 rounded-full bg-rr-noir" />
            </span>
          </div>
          <button type="button" onClick={test} disabled={pending} className={secondary}>
            {pending ? "Envoi…" : "Recevoir une notification test"}
          </button>
          <button type="button" onClick={disable} className="text-sm text-rr-gris hover:text-rr-gris-clair">
            Désactiver sur cet appareil
          </button>
        </>
      )}

      {message && <p className="text-sm text-rr-gris-clair">{message}</p>}
    </div>
  );
}
