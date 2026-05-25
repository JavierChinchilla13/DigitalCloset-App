import React, { useEffect, useRef, useState } from 'react';
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
  const modularDataRef = useRef(modularData);
  const warpvasInstances = useRef<Map<string, any>>(new Map());

  // Update ref whenever modularData changes
  useEffect(() => {
    modularDataRef.current = modularData;
  }, [modularData]);

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
      selection: true,
    });

    fabricCanvasRef.current = canvas;
    if (onCanvasReady) onCanvasReady(canvas);

    const handleModified = (e: any) => {
      if (isUpdatingRef.current) return;
      
      const canvasHeight = canvas.getHeight();
      const currentData: ModularJacketData = {
        ...modularDataRef.current,
        renderOrder: canvas.getObjects()
          .filter(obj => obj.name && obj.name !== 'mannequin')
          .map(obj => obj.name!)
      };

      canvas.getObjects().forEach(obj => {
        if (obj.name && obj.name !== 'mannequin') {
          const virtualTransform = getVirtualTransform(obj, canvasHeight);
          // Preserve the original scaleX/scaleY from the object instead of normalizing to 1
          virtualTransform.scaleX = obj.scaleX!;
          virtualTransform.scaleY = obj.scaleY!;
          
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
  }, [segments]); // Re-init only if segments change

  // ... (responsiveness and openness effects unchanged) ...

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
            hasControls: name === activePart,
            stroke: name === activePart ? '#5B8CFF' : undefined,
            strokeWidth: name === activePart ? 2 : 0
          });

          if (savedTransform) {
             segmentImg.set({
               scaleX: savedTransform.scaleX,
               scaleY: savedTransform.scaleY
             });
          } else {
             segmentImg.scaleToWidth(toCanvasCoord(350, canvasHeight));
          }

          canvas.add(segmentImg);
        }

        const activeObj = canvas.getObjects().find(obj => obj.name === activePart);
        if (activeObj) canvas.setActiveObject(activeObj);

        canvas.requestRenderAll();
        isUpdatingRef.current = false;
      } catch (err) {
        console.error("Error loading images into Jacket canvas:", err);
        isUpdatingRef.current = false;
      }
    };

    initObjects();
    return () => { cancelled = true; };
  }, [segments, mannequinUrl, canvasSize]);

  // Sync internal Fabric objects when modularData changes from outside
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    // CRITICAL: Block sync if we are currently interacting or updating
    if (!canvas || isUpdatingRef.current) return;

    const canvasHeight = canvas.getHeight();
    let hasChanged = false;

    canvas.getObjects().forEach(obj => {
      if (obj.name && obj.name !== 'mannequin') {
        const segmentData = modularData.segments[obj.name as keyof ModularJacketData['segments']];
        if (segmentData) {
          const t = segmentData.transform;
          
          // Only update if there's a significant difference to avoid jitters
          const currentX = toVirtualCoord(obj.left!, canvasHeight);
          const currentY = toVirtualCoord(obj.top!, canvasHeight);
          
          if (Math.abs(currentX - t.x) > 0.1 || Math.abs(currentY - t.y) > 0.1 || 
              Math.abs(obj.scaleX! - t.scaleX) > 0.001 || obj.angle !== t.rotation) {
            
            obj.set({
              left: toCanvasCoord(t.x, canvasHeight),
              top: toCanvasCoord(t.y, canvasHeight),
              angle: t.rotation,
              opacity: t.opacity ?? 1,
              flipX: t.flipX ?? false,
              flipY: t.flipY ?? false,
              scaleX: t.scaleX,
              scaleY: t.scaleY
            });
            obj.setCoords();
            hasChanged = true;
          }
        }
      }
    });

    if (hasChanged) canvas.requestRenderAll();
  }, [modularData]);

  // Handle Active Part Selection
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.getObjects().forEach(obj => {
      if (obj.name && obj.name !== 'mannequin') {
        const isActive = obj.name === activePart;
        obj.set({ 
          selectable: true,
          hasControls: isActive,
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
