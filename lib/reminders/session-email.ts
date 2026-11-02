import nodemailer from "nodemailer";

type Params = { to: string; firstName: string; hour: string; title: string };

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Envoie l'e-mail du jour de séance via un compte Gmail (mot de passe
 * d'application). Variables d'environnement : GMAIL_USER et GMAIL_APP_PASSWORD.
 * Sans elles, rien n'est envoyé (la notification, elle, part quand même).
 */
export async function sendSessionEmail({ to, firstName, hour, title }: Params): Promise<boolean> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return false;

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    const hello = firstName ? `Bonjour ${escapeHtml(firstName)},` : "Bonjour,";
    const t = escapeHtml(title);
    await transporter.sendMail({
      from: `"Le Programme Re-Naissance" <${user}>`,
      to,
      subject: `Ta séance d'aujourd'hui à ${hour}`,
      text: `${hello.replace(/&amp;/g, "&")}\n\nAujourd'hui à ${hour} : ${title}.\n\nPrends quelques minutes pour t'installer au calme avant la séance.\n\nÀ tout à l'heure,\nMohamed`,
      html: `<div style="background:#07060d;padding:32px 20px;font-family:Georgia,serif;color:#f4eee2">
  <div style="max-width:480px;margin:0 auto">
    <p style="letter-spacing:4px;font-size:11px;color:#d4af6a;text-transform:uppercase">Le Programme Re-Naissance</p>
    <h1 style="font-weight:400;font-style:italic;font-size:30px;margin:18px 0">Ta séance d'aujourd'hui</h1>
    <p style="font-size:16px;line-height:1.6;color:#e9dec6">${hello}</p>
    <p style="font-size:20px;line-height:1.5;margin:18px 0"><span style="color:#d4af6a">${escapeHtml(hour)}</span> · ${t}</p>
    <p style="font-size:15px;line-height:1.6;color:#b9b4c8">Prends quelques minutes pour t'installer au calme avant la séance.</p>
    <p style="font-size:15px;color:#b9b4c8;margin-top:28px">À tout à l'heure,<br>Mohamed</p>
  </div>
</div>`,
    });
    return true;
  } catch {
    return false;
  }
}
