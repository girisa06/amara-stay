import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function RoomGallery({ photos = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (photos.length === 0) {
    return (
      <div className="aspect-video rounded-xl2 bg-secondary flex items-center justify-center text-ink/40">
        No photos available
      </div>
    );
  }

  const close = () => setActiveIndex(null);
  const next = (e) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i + 1) % photos.length);
  };
  const prev = (e) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  };

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl2 overflow-hidden h-80 sm:h-[420px]">
        <button
          onClick={() => setActiveIndex(0)}
          className="col-span-4 sm:col-span-2 row-span-2 relative"
        >
          <img
            src={photos[0].url}
            alt="Room view"
            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          />
        </button>
        {photos.slice(1, 5).map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(i + 1)}
            className="hidden sm:block relative overflow-hidden"
          >
            <img
              src={photo.url}
              alt="Room view"
              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={close}
          >
            <button onClick={close} className="absolute top-5 right-5 text-white/80 hover:text-white">
              <X className="h-7 w-7" />
            </button>
            <button
              onClick={prev}
              className="absolute left-3 sm:left-6 text-white/80 hover:text-white p-2"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              src={photos[activeIndex].url}
              alt="Room view"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={next}
              className="absolute right-3 sm:right-6 text-white/80 hover:text-white p-2"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
