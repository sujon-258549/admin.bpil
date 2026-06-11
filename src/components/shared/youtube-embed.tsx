interface YoutubeEmbedProps {
  youtubeId: string;
  className?: string;
}

export function YoutubeEmbed({ youtubeId, className = "" }: YoutubeEmbedProps) {
  if (!youtubeId) return null;

  return (
    <div className={`overflow-hidden rounded-md border bg-muted/20 shadow-sm aspect-video ${className}`}>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
