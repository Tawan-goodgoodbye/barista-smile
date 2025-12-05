import React, { useState, useRef, useCallback } from 'react';

interface ComparisonSliderProps {
  original: string;
  processed: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ original, processed }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = () => setIsResizing(false);
  
  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isResizing || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const width = rect.width;
    const newPosition = ((x - rect.left) / width) * 100;

    setPosition(Math.min(Math.max(newPosition, 0), 100));
  }, [isResizing]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden cursor-col-resize select-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Image (Original) */}
      <img 
        src={original} 
        alt="Original" 
        className="absolute top-0 left-0 w-full h-full object-cover" 
      />

      {/* Foreground Image (Processed) - Clipped */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img 
          src={processed} 
          alt="Processed" 
          className="absolute top-0 left-0 max-w-none h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth }} 
        />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg z-10"
        style={{ left: `${position}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl text-orange-600">
          ↔
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
