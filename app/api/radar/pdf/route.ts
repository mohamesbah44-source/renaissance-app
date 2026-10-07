import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 3 * 1024 * 1024;

/** Renvoie le PDF généré côté navigateur comme un vrai téléchargement (en-tête attachment). */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const data = String(form.get("data") ?? "");
    const rawName = String(form.get("filename") ?? "rapport-renaissance.pdf");

    const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "rapport-renaissance.pdf";
    const filename = safeName.toLowerCase().endsWith(".pdf") ? safeName : `${safeName}.pdf`;

    if (!data || data.length > MAX_BYTES * 1.4) {
      return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
    }

    const buffer = Buffer.from(data, "base64");
    if (buffer.length === 0 || buffer.length > MAX_BYTES || buffer.subarray(0, 4).toString("latin1") !== "%PDF") {
      return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
    }

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Téléchargement impossible." }, { status: 500 });
  }
}
