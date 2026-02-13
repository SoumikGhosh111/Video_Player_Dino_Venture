import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const VideoCard = ({ video, categoryName, onClick }) => {
  return (
    <Card 
      className="group cursor-pointer border-none bg-transparent shadow-none"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted flex justify-center items-center">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="object-cover h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold leading-tight line-clamp-2 text-[15px]">
          {video.title}
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-muted-foreground uppercase">
            {categoryName}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard; 