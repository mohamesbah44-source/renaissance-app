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
    <div className="mt-7 flex flex-col gap-5">
      {week.video_url && (
        <GlassCard className="overflow-hidden p-0">
          {isVideoFile(week.video_url) ? (
            <video controls className="aspect-video w-full">
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
        <GlassCard className="flex flex-col gap-5 p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Pratiques audio</p>
          {audios.map((audio) => (
            <div key={audio.label}>
              <p className="mb-2 text-sm text-white/70">{audio.label}</p>
              <audio controls src={audio.url} className="w-full" />
            </div>
          ))}
        </GlassCard>
      )}

      {pdfs.length > 0 && (
        <GlassCard className="flex flex-col gap-3 p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Documents</p>
          {pdfs.map((pdf) => (
            <a
              key={pdf.url}
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl -mx-2 px-2 py-1.5 text-sm text-white/70 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rr-or/[0.1] transition-all duration-300 group-hover:bg-rr-or/[0.18]">
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
