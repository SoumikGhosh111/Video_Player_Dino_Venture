import React, { useState } from 'react';
import { videoData } from '@/data/videoData';
import VideoPlayer from '@/components/custom/VideoPlayer';
import VideoCard from '@/components/custom/VideoCard';
import CategoryBar from '@/components/custom/CategoryBar';

const HomePage = () => {
  // 1. State for Filtering
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 2. State for the Video Player
  const [activeVideo, setActiveVideo] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // 3. Filter Logic
  const displayCategories = selectedCategory === "All"
    ? videoData.categories
    : videoData.categories.filter(c => c.category.name === selectedCategory);

  return (
    <div className="relative min-h-screen bg-background text-foreground">

      {/* Category Navigation (Top) */}
      <CategoryBar
        categories={videoData.categories}
        selected={selectedCategory}
        onSelect={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Feed */}
      <main className={`p-4 space-y-12x ${activeVideo && !isMinimized ? 'hidden' : 'block'}`}>
        {displayCategories.map((catWrapper) => (
          <section key={catWrapper.category.slug}>
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
                    setIsMinimized(false); // Open full screen on click
                  }}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Persistent Video Player Overlay */}
      {activeVideo && (
        <VideoPlayer
          video={activeVideo}
          isMinimized={isMinimized}
          setMinimized={setIsMinimized}
          onClose={() => setActiveVideo(null)}
          onVideoSwitch={(newVideo) => {
            setActiveVideo(newVideo);
            setIsMinimized(false); // Maximize the player for the new video
          }}
        />
      )}
    </div>
  );
};

export default HomePage;