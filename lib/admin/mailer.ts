import nodemailer from "nodemailer";

type InviteEmail = {
  to: string;
  firstName: string;
  link: string;
  existing: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendInviteEmail({ to, firstName, link, existing }: InviteEmail): Promise<{ ok: boolean; error?: string }> {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) {
    return { ok: false, error: "L'envoi automatique des e-mails n'est pas encore configuré." };
  }

  const name = escapeHtml(firstName);
  const subject = existing
    ? "Ton lien pour choisir un nouveau mot de passe"
    : "Bienvenue dans le Programme Re-Naissance™";
  const intro = existing
    ? "Voici ton lien personnel pour choisir un nouveau mot de passe."
    : "Ton espace Re-Naissance™ est prêt. Clique ci-dessous pour choisir ton mot de passe et entrer dans le programme.";
  const button = existing ? "Choisir un nouveau mot de passe" : "Choisir mon mot de passe";

  const text = `Bonjour ${firstName},

${intro}

${link}

Ce lien est personnel et valable 24 heures. S'il a expiré, écris-moi et je t'en envoie un nouveau.

À très vite,
Mohamed
Re-Naissance™`;

  const html = `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:0;background:#05060d;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#05060d;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr><td style="padding-bottom:28px;text-align:center;color:#c9a961;font-size:12px;letter-spacing:4px;text-transform:uppercase;">Re-Naissance™</td></tr>
        <tr><td style="background:#0b0d1c;border:1px solid #1d2040;border-radius:20px;padding:36px 30px;">
          <p style="margin:0 0 18px;color:#f4efe6;font-size:22px;line-height:1.3;">Bonjour ${name},</p>
          <p style="margin:0 0 28px;color:#b9b6c9;font-size:16px;line-height:1.65;">${escapeHtml(intro)}</p>
          <p style="margin:0 0 28px;text-align:center;">
            <a href="${link}" style="display:inline-block;background:#c9a961;color:#05060d;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;padding:15px 34px;border-radius:999px;">${escapeHtml(button)}</a>
          </p>
          <p style="margin:0 0 10px;color:#8b88a0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;">Ce lien est personnel et valable 24 heures. S'il a expiré, écris-moi et je t'en envoie un nouveau.</p>
          <p style="margin:0;color:#6c6a82;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;word-break:break-all;">Si le bouton ne fonctionne pas, copie ce lien dans ton navigateur :<br>${escapeHtml(link)}</p>
        </td></tr>
        <tr><td style="padding-top:24px;text-align:center;color:#8b88a0;font-size:14px;line-height:1.6;">À très vite,<br>Mohamed</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    const fromName = process.env.SMTP_FROM_NAME || "Re-Naissance™";
    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to,
      subject,
      text,
      html,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "L'e-mail n'a pas pu être envoyé. Utilise le lien ci-dessous." };
  }
}
