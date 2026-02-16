import React, { useState, useEffect } from 'react';
import { videoData } from '@/data/videoData';
import VideoPlayer from '@/components/custom/VideoPlayer';
import VideoCard from '@/components/custom/VideoCard';
import CategoryBar from '@/components/custom/CategoryBar';
import { Skeleton } from "@/components/ui/skeleton"; // Import the skeleton

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // 1. Loading State
  const [isLoading, setIsLoading] = useState(true);

  // 2. Simulate Data Loading (fetching from internal_wallet_db)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5s delay to show off the skeleton
    return () => clearTimeout(timer);
  }, []);

  const displayCategories = selectedCategory === "All"
    ? videoData.categories
    : videoData.categories.filter(c => c.category.name === selectedCategory);

  // 3. Skeleton Helper Component
  const SkeletonFeed = () => (
    <div className="space-y-12">
      {[1, 2].map((section) => (
        <div key={section}>
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((card) => (
              <div key={card} className="space-y-3">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <CategoryBar
        categories={videoData.categories}
        selected={selectedCategory}
        onSelect={(cat) => setSelectedCategory(cat)}
      />

      <main className={`p-4 ${activeVideo && !isMinimized ? 'hidden' : 'block'}`}>
        {isLoading ? (
          <SkeletonFeed />
        ) : (
          displayCategories.map((catWrapper) => (
            <section key={catWrapper.category.slug} className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <img src={catWrapper.category.iconUrl} alt="" className="w-6 h-6" />
                <h2 className="text-xl font-bold">{catWrapper.category.name}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {catWrapper.contents.map((video) => (
                  <VideoCard
                    key={video.slug}
                    video={video}
                    categoryName={catWrapper.category.name}
                    onClick={() => {
                      setActiveVideo(video);
                      setIsMinimized(false);
                    }}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {activeVideo && (
        <VideoPlayer
          video={activeVideo}
          isMinimized={isMinimized}
          setMinimized={setIsMinimized}
          onClose={() => setActiveVideo(null)}
          onVideoSwitch={(newVideo) => {
            setActiveVideo(newVideo);
            setIsMinimized(false);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;