import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Image as FabricImage, Rect, Object as FabricObject } from 'fabric';
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

// Conditionally import FabricWarpvas as it might not be compatible with all environments
let FabricWarpvas: any;
import('fabric-warpvas').then(m => {
  FabricWarpvas = m.FabricWarpvas;
}).catch(err => console.error("Failed to load fabric-warpvas:", err));

interface JacketCanvasProps {
  segments: Record<string, string>; // name -> imageUrl
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
  const warpvasInstances = useRef<Map<string, any>>(new Map());

  const mannequinUrl = personaType === PersonaType.MALE 
    ? '/personas/male-base.png' 
    : '/personas/female-base.png';

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    customizeFabricControls();

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: false,
    });

    fabricCanvasRef.current = canvas;
    if (onCanvasReady) onCanvasReady(canvas);

    const handleModified = () => {
      if (isUpdatingRef.current) return;
      
      const canvasHeight = canvas.getHeight();
      const currentData: ModularJacketData = {
        segments: { ...modularData.segments },
        isOpen: modularData.isOpen,
        renderOrder: canvas.getObjects()
          .filter(obj => obj.name && obj.name !== 'mannequin')
          .map(obj => obj.name!)
      };

      canvas.getObjects().forEach(obj => {
        if (obj.name && obj.name !== 'mannequin') {
          const virtualTransform = getVirtualTransform(obj, canvasHeight);
          currentData.segments[obj.name as keyof ModularJacketData['segments']] = {
            imageUrl: segments[obj.name] || '',
            transform: virtualTransform
          };
        }
      });

      onDataChange(currentData);
    };

    canvas.on('object:modified', handleModified);
    canvas.on('object:scaling', handleModified);
    canvas.on('object:moving', handleModified);
    canvas.on('object:rotating', handleModified);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [segments]);

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

        setCanvasSize({ width, height });
        
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.setDimensions({ width, height });
          fabricCanvasRef.current.requestRenderAll();
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', updateSize);
      observer.disconnect();
    };
  }, []);

  // Load Mannequin and Jacket Segments
  useEffect(() => {
    let cancelled = false;

    const initObjects = async () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas || canvasSize.height === 0) return;

      try {
        isUpdatingRef.current = true;
        const mannequin = await loadFabricImage(mannequinUrl);
        if (cancelled) return;

        canvas.clear();

        mannequin.set({
          name: 'mannequin',
          originX: 'center',
          originY: 'center',
        });
        
        const mannequinScale = canvas.getHeight() / mannequin.height!;
        mannequin.scale(mannequinScale);
        
        centerObject(canvas, mannequin);
        lockObject(mannequin);
        canvas.add(mannequin);
        canvas.sendObjectToBack(mannequin);

        const canvasHeight = canvas.getHeight();
        
        // Load Segments
        for (const [name, url] of Object.entries(segments)) {
          const segmentImg = await loadFabricImage(url);
          if (cancelled) return;

          const savedTransform = modularData.segments[name as keyof ModularJacketData['segments']]?.transform;

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
            uniformScaling: false,
            selectable: true, // Always selectable to allow free movement
            hasControls: name === activePart, // Only show handles for the active part
            stroke: name === activePart ? '#5B8CFF' : undefined,
            strokeWidth: name === activePart ? 2 : 0
          });

          const virtualWidth = savedTransform?.width || 350;
          segmentImg.scaleToWidth(toCanvasCoord(virtualWidth, canvasHeight));
          
          if (savedTransform?.height) {
            segmentImg.set({ scaleY: toCanvasCoord(savedTransform.height, canvasHeight) / segmentImg.getOriginalSize().height });
          }

          canvas.add(segmentImg);
        }

        const activeObj = canvas.getObjects().find(obj => obj.name === activePart);
        if (activeObj) canvas.setActiveObject(activeObj);

        canvas.requestRenderAll();
        isUpdatingRef.current = false;
      } catch (err) {
        console.error("Error loading images into Jacket canvas:", err);
      }
    };

    initObjects();
    return () => { cancelled = true; };
  }, [segments, mannequinUrl, canvasSize]);

  // Sync internal Fabric objects when modularData changes from outside
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isUpdatingRef.current) return;

    const canvasHeight = canvas.getHeight();
    canvas.getObjects().forEach(obj => {
      if (obj.name && obj.name !== 'mannequin') {
        const segmentData = modularData.segments[obj.name as keyof ModularJacketData['segments']];
        if (segmentData) {
          const t = segmentData.transform;
          obj.set({
            left: toCanvasCoord(t.x, canvasHeight),
            top: toCanvasCoord(t.y, canvasHeight),
            angle: t.rotation,
            opacity: t.opacity ?? 1,
            flipX: t.flipX ?? false,
            flipY: t.flipY ?? false,
          });

          if (t.width) obj.scaleToWidth(toCanvasCoord(t.width, canvasHeight));
          if (t.height) obj.set({ scaleY: toCanvasCoord(t.height, canvasHeight) / obj.getOriginalSize().height });

          obj.setCoords();
        }
      }
    });
    canvas.requestRenderAll();
  }, [modularData]);

  // Handle Active Part Selection
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.getObjects().forEach(obj => {
      if (obj.name && obj.name !== 'mannequin') {
        const isActive = obj.name === activePart;
        obj.set({ 
          selectable: true, // Always allow selection
          hasControls: isActive, // Only show handles for the active part
          stroke: isActive ? '#5B8CFF' : undefined,
          strokeWidth: isActive ? 2 : 0
        });
      }
    });

    const activeObj = canvas.getObjects().find(obj => obj.name === activePart);
    if (activeObj) {
      canvas.setActiveObject(activeObj);
    }
    
    canvas.requestRenderAll();
  }, [activePart]);

  // Handle Warp Mode
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !FabricWarpvas) return;

    const activeObj = canvas.getObjects().find(obj => obj.name === activePart);
    if (!activeObj || !isWarpMode) {
      return;
    }

    if (activePart.includes('Sleeve')) {
      const warpInstance = new FabricWarpvas(canvas, activeObj, {
        gridSize: 8,
        showGrid: true,
      });
      warpvasInstances.current.set(activePart, warpInstance);
    }
  }, [isWarpMode, activePart]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] flex items-center justify-center bg-black/40 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-inner"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(#5B8CFF 1px, transparent 1px)', 
          backgroundSize: '30px 30px' 
        }} 
      />
      <canvas ref={canvasRef} />
      <div className="absolute bottom-6 left-6 flex items-center gap-4 opacity-40 pointer-events-none">
        <div className="flex flex-col gap-1">
          <p className="text-[7px] font-black tracking-[0.4em] text-white uppercase">Modular Jacket Engine</p>
          <p className="text-[7px] font-black tracking-[0.4em] text-accent uppercase">Independent Segment Manipulation</p>
        </div>
      </div>
    </div>
  );
};

export default JacketCanvas;
