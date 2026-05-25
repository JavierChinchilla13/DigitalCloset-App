import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, Image as FabricImage, Rect, Object as FabricObject, Group } from 'fabric';
import { PersonaType, ClothingCategory, type ClothingTransform, type ModularJacketData } from '../../types';
import { 
  VIRTUAL_HEIGHT, 
  ASPECT_RATIO, 
  toCanvasCoord, 
  toVirtualCoord, 
  loadFabricImage, 
  centerObject,
  getVirtualTransform
} from './CanvasUtils';
import { customizeFabricControls, lockObject } from './FabricControls';

// Conditionally import FabricWarpvas
let FabricWarpvas: any;
import('fabric-warpvas').then(m => {
  FabricWarpvas = m.FabricWarpvas;
}).catch(err => console.error("Failed to load fabric-warpvas:", err));

interface JacketCanvasProps {
  segments: Record<string, string>;
  personaType: PersonaType;
  modularData: ModularJacketData;
  onDataChange: (data: ModularJacketData) => void;
  onCanvasReady?: (canvas: Canvas) => void;
  activePart?: string;
  isWarpMode?: boolean;
}

const JacketCanvas: React.FC<JacketCanvasProps> = ({ 
  segments, 
  personaType, 
  modularData,
  onDataChange,
  onCanvasReady,
  activePart = 'torso',
  isWarpMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  
  const isUpdatingRef = useRef(false);
  const modularDataRef = useRef(modularData);
  const warpvasInstances = useRef<Map<string, any>>(new Map());

  // Keep ref up to date for event handlers
  useEffect(() => {
    modularDataRef.current = modularData;
  }, [modularData]);

  // Unified Initialization and Loading
  useEffect(() => {
    if (!canvasRef.current || canvasSize.height === 0) return;
    let cancelled = false;

    customizeFabricControls();

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: true,
      width: canvasSize.width,
      height: canvasSize.height
    });

    fabricCanvasRef.current = canvas;
    if (onCanvasReady) onCanvasReady(canvas);

    const handleModified = () => {
      if (isUpdatingRef.current || cancelled) return;
      
      const canvasHeight = canvas.getHeight();
      const currentData: ModularJacketData = {
        ...modularDataRef.current,
        renderOrder: canvas.getObjects()
          .filter(obj => obj.name && obj.name !== 'mannequin')
          .map(obj => obj.name!)
      };

      canvas.getObjects().forEach(obj => {
        if (obj.name && obj.name !== 'mannequin') {
          currentData.segments[obj.name as keyof ModularJacketData['segments']] = {
            imageUrl: segments[obj.name] || '',
            transform: getVirtualTransform(obj, canvasHeight)
          };
        }
      });

      onDataChange(currentData);
    };

    canvas.on('object:modified', handleModified);
    canvas.on('object:scaling', handleModified);
    canvas.on('object:moving', handleModified);
    canvas.on('object:rotating', handleModified);

    const initObjects = async () => {
      try {
        isUpdatingRef.current = true;
        
        // 1. Mannequin
        const mannequinUrl = personaType === PersonaType.MALE 
          ? '/personas/male-base.png' 
          : '/personas/female-base.png';
        const mannequin = await loadFabricImage(mannequinUrl);
        if (cancelled) return;

        mannequin.set({
          name: 'mannequin',
          originX: 'center',
          originY: 'center',
        });
        mannequin.scale(canvas.getHeight() / mannequin.height!);
        centerObject(canvas, mannequin);
        lockObject(mannequin);
        canvas.add(mannequin);
        canvas.sendObjectToBack(mannequin);

        // 2. Jacket Segments
        const canvasHeight = canvas.getHeight();
        for (const [name, url] of Object.entries(segments)) {
          const segmentImg = await loadFabricImage(url);
          if (cancelled) return;

          const savedTransform = modularDataRef.current.segments[name as keyof ModularJacketData['segments']]?.transform;

          segmentImg.set({
            name,
            originX: 'center',
            originY: 'center',
            left: savedTransform ? toCanvasCoord(savedTransform.x, canvasHeight) : canvas.getCenterPoint().x,
            top: savedTransform ? toCanvasCoord(savedTransform.y, canvasHeight) : canvas.getCenterPoint().y,
            angle: savedTransform?.rotation || 0,
            opacity: savedTransform?.opacity ?? 1,
            flipX: savedTransform?.flipX ?? false,
            flipY: savedTransform?.flipY ?? false,
            objectCaching: false,
            selectable: true,
          });

          // Accurate Scale Initialization
          const virtualWidth = savedTransform?.width || 350;
          const virtualHeight = savedTransform?.height;
          
          segmentImg.scaleToWidth(toCanvasCoord(virtualWidth, canvasHeight));
          if (virtualHeight) {
            segmentImg.set({ scaleY: toCanvasCoord(virtualHeight, canvasHeight) / segmentImg.getOriginalSize().height });
          }

          canvas.add(segmentImg);
        }

        // 3. Selection State
        const activeObj = canvas.getObjects().find(obj => obj.name === activePart);
        if (activeObj) canvas.setActiveObject(activeObj);

        canvas.requestRenderAll();
        isUpdatingRef.current = false;
      } catch (err) {
        console.error("Error initializing Jacket Canvas:", err);
        isUpdatingRef.current = false;
      }
    };

    initObjects();

    return () => {
      cancelled = true;
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [segments, personaType, canvasSize]); // Re-init on hard changes

  // Handle Dynamic Visual State (Openness, Active Highlight, Warp)
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isUpdatingRef.current) return;

    // A. Center Opening Mask
    const torso = canvas.getObjects().find(obj => obj.name === 'torso');
    if (torso) {
      if (modularData.openness && modularData.openness > 0) {
        const w = torso.width!;
        const h = torso.height!;
        const holeWidth = w * modularData.openness;
        const leftRect = new Rect({ left: -w/2, top: -h/2, width: (w-holeWidth)/2, height: h, fill: 'white' });
        const rightRect = new Rect({ left: holeWidth/2, top: -h/2, width: (w-holeWidth)/2, height: h, fill: 'white' });
        torso.set({ clipPath: new Group([leftRect, rightRect], { originX: 'center', originY: 'center' }) });
      } else {
        torso.set({ clipPath: undefined });
      }
    }

    // B. Active Part Highlighting
    canvas.getObjects().forEach(obj => {
      if (obj.name && obj.name !== 'mannequin') {
        const isActive = obj.name === activePart;
        obj.set({ 
          hasControls: isActive,
          stroke: isActive ? '#5B8CFF' : undefined,
          strokeWidth: isActive ? 2 : 0
        });
      }
    });

    const activeObj = canvas.getObjects().find(obj => obj.name === activePart);
    if (activeObj && canvas.getActiveObject() !== activeObj) {
      canvas.setActiveObject(activeObj);
    }

    canvas.requestRenderAll();
  }, [modularData.openness, activePart]);

  // Handle Responsiveness
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { offsetWidth, offsetHeight } = containerRef.current;
        let width = offsetWidth;
        let height = offsetWidth / ASPECT_RATIO;
        if (height > offsetHeight) {
          height = offsetHeight;
          width = height * ASPECT_RATIO;
        }
        if (Math.abs(canvasSize.width - width) > 5 || Math.abs(canvasSize.height - height) > 5) {
          setCanvasSize({ width, height });
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    const obs = new ResizeObserver(updateSize);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => {
      window.removeEventListener('resize', updateSize);
      obs.disconnect();
    };
  }, [canvasSize]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-black/40 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-inner">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#5B8CFF 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <canvas ref={canvasRef} />
      <div className="absolute bottom-6 left-6 flex items-center gap-4 opacity-40 pointer-events-none">
        <div className="flex flex-col gap-1">
          <p className="text-[7px] font-black tracking-[0.4em] text-white uppercase">Modular Jacket Engine</p>
          <p className="text-[7px] font-black tracking-[0.4em] text-accent uppercase">Synchronized Layer Orchestration</p>
        </div>
      </div>
    </div>
  );
};

export default JacketCanvas;
