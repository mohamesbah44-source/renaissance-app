import { FileText } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Week, WeekPdf } from "@/lib/types/database.types";

function isVideoFile(url: string) {
  return /\.(mp4|webm|mov|m4v)$/i.test(url);
}

interface MediaSectionProps {
  week: Week;
  pdfs: WeekPdf[];
}

export function MediaSection({ week, pdfs }: MediaSectionProps) {
  const audios = [
    { label: "Respiration", url: week.audio_breathwork_url },
    { label: "Méditation", url: week.audio_meditation_url },
    { label: "Visualisation", url: week.audio_visualization_url },
  ].filter((audio): audio is { label: string; url: string } => Boolean(audio.url));

  const hasMedia = Boolean(week.video_url) || audios.length > 0 || pdfs.length > 0;

  if (!hasMedia) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {week.video_url && (
        <GlassCard className="overflow-hidden p-0">
          {isVideoFile(week.video_url) ? (
            <video controls playsInline className="aspect-video w-full">
              <source src={week.video_url} />
            </video>
          ) : (
            <iframe
              src={week.video_url}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </GlassCard>
      )}

      {audios.length > 0 && (
        <GlassCard className="flex flex-col gap-5 p-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Pratiques audio</p>
          {audios.map((audio) => (
            <div key={audio.label}>
              <p className="mb-2 font-rr-display text-base text-rr-ivoire">{audio.label}</p>
              <audio controls src={audio.url} className="w-full [color-scheme:dark]" />
            </div>
          ))}
        </GlassCard>
      )}

      {pdfs.length > 0 && (
        <GlassCard className="flex flex-col gap-3 p-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-rr-gris">Documents</p>
          {pdfs.map((pdf) => (
            <a
              key={pdf.url}
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-2 text-sm text-rr-ivoire/90 transition-all duration-300 hover:bg-white/[0.05]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rr-or/[0.12] transition-all duration-300 group-hover:bg-rr-or/[0.2]">
                <FileText className="h-4 w-4 text-rr-or-clair" />
              </span>
              {pdf.title}
            </a>
          ))}
        </GlassCard>
      )}
    </div>
  );
}
