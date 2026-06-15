import React, { useState } from 'react';
import { Pannellum } from 'pannellum-react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Room360ViewerProps {
  imageUrl: string;
}

const Room360Viewer: React.FC<Room360ViewerProps> = ({ imageUrl }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`relative rounded-xl overflow-hidden shadow-lg ${
        isFullscreen ? 'fixed inset-0 z-50 w-full h-full rounded-none' : 'w-full h-[400px] md:h-[500px]'
      }`}
    >
      {/* Nút phóng to / thu nhỏ góc trên bên phải */}
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
        title={isFullscreen ? "Thu nhỏ" : "Phóng to toàn màn hình"}
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

      {/* Gợi ý tương tác */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-2 pointer-events-none">
        <span className="animate-pulse">🔄</span> Kéo để xoay 360°
      </div>

      <Pannellum
        width="100%"
        height="100%"
        image={imageUrl}
        pitch={10}
        yaw={180}
        hfov={110}
        autoLoad={true}
        showZoomCtrl={true}
        showFullscreenCtrl={false} // Disable default fullscreen to use custom UI
        autoRotate={-2} // Tự động xoay chậm nhẹ nhàng để tạo hiệu ứng sống động
      >
        <Pannellum.Hotspot 
          type="info"
          pitch={11}
          yaw={-167}
          text="Khám phá phòng"
        />
      </Pannellum>
    </div>
  );
};

export default Room360Viewer;
