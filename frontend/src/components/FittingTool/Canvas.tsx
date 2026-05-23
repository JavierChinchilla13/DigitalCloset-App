import React, { useRef, useEffect, useState } from 'react';
import Moveable from 'react-moveable';
import { PersonaType, type ClothingTransform } from '../../types';

interface CanvasProps {
  imageUrl: string;
  personaType: PersonaType;
  transform: ClothingTransform;
  onTransformChange: (transform: ClothingTransform) => void;
}

const Canvas: React.FC<CanvasProps> = ({ imageUrl, personaType, transform, onTransformChange }) => {
  const targetRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  const mannequinUrl = personaType === PersonaType.MALE 
    ? '/personas/male-base.png' 
    : '/personas/female-base.png';

  const VIRTUAL_HEIGHT = 1000;
  const viewScale = containerHeight / VIRTUAL_HEIGHT;

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
      
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (targetRef.current && containerHeight > 0) {
      const x = transform.x * viewScale;
      const y = transform.y * viewScale;
      const width = (transform.width || 0) * viewScale;
      const height = (transform.height || 0) * viewScale;
      
      targetRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${transform.rotation}deg) scale(${transform.scale})`;
      targetRef.current.style.width = width ? `${width}px` : 'auto';
      targetRef.current.style.height = height ? `${height}px` : 'auto';
    }
  }, [transform, containerHeight, viewScale]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[3/4] bg-black/20 rounded-[2rem] overflow-hidden flex items-center justify-center border border-white/5"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/[0.05] to-transparent pointer-events-none" />

      {/* Identical Layout to PersonaLayer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src={mannequinUrl} 
          alt="Mannequin" 
          className="h-full w-auto object-contain opacity-40 select-none"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          ref={targetRef}
          src={imageUrl}
          alt="Garment"
          className="cursor-move select-none pointer-events-auto absolute"
          style={{ 
            zIndex: 10,
            maxWidth: 'none',
            maxHeight: 'none'
          }}
        />
      </div>

      {containerHeight > 0 && (
        <Moveable
          target={targetRef}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={true}
          throttleDrag={1}
          throttleRotate={0.2}
          renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
          onDrag={e => {
            onTransformChange({
              ...transform,
              x: e.beforeTranslate[0] / viewScale,
              y: e.beforeTranslate[1] / viewScale,
            });
          }}
          onRotate={e => {
            onTransformChange({
              ...transform,
              rotation: e.beforeRotate,
            });
          }}
          onResize={e => {
            onTransformChange({
              ...transform,
              width: e.width / viewScale,
              height: e.height / viewScale,
              x: e.drag.beforeTranslate[0] / viewScale,
              y: e.drag.beforeTranslate[1] / viewScale,
            });
          }}
          className="custom-moveable"
          origin={false}
          edge={false}
        />
      )}

      <style>{`
        .custom-moveable .moveable-line { background-color: #A3E635 !important; opacity: 0.5; }
        .custom-moveable .moveable-control {
          background-color: #fff !important;
          border: 2px solid #A3E635 !important;
          width: 12px !important;
          height: 12px !important;
          margin-top: -6px !important;
          margin-left: -6px !important;
          border-radius: 50% !important;
        }
        .custom-moveable .moveable-rotation-line { background-color: #A3E635 !important; }
        .custom-moveable .moveable-rotation-control { background-color: #A3E635 !important; border: none !important; }
      `}</style>
    </div>
  );
};

export default Canvas;
