import { Image as FabricImage, Object as FabricObject, Canvas, Rect } from 'fabric';

/**
 * Constants for the virtual coordinate system.
 * Baseline height is 1000px, aspect ratio 3:4, width 750px.
 */
export const VIRTUAL_HEIGHT = 1000;
export const ASPECT_RATIO = 3 / 4;
export const VIRTUAL_WIDTH = VIRTUAL_HEIGHT * ASPECT_RATIO;

/**
 * Converts virtual units (0-1000) to actual canvas pixels.
 */
export const toCanvasCoord = (virtualValue: number, canvasHeight: number) => {
  return (virtualValue * canvasHeight) / VIRTUAL_HEIGHT;
};

/**
 * Converts actual canvas pixels to virtual units (0-1000).
 */
export const toVirtualCoord = (canvasValue: number, canvasHeight: number) => {
  return (canvasValue * VIRTUAL_HEIGHT) / canvasHeight;
};

/**
 * Loads an image into a FabricImage object.
 */
export const loadFabricImage = (url: string): Promise<FabricImage> => {
  return FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
};

/**
 * Gets the current transform data from a Fabric object in absolute virtual units.
 */
export const getVirtualTransform = (obj: FabricObject, canvasHeight: number) => {
  const scaledWidth = obj.getScaledWidth();
  const scaledHeight = obj.getScaledHeight();

  const transform = {
    x: toVirtualCoord(obj.left || 0, canvasHeight),
    y: toVirtualCoord(obj.top || 0, canvasHeight),
    width: toVirtualCoord(scaledWidth, canvasHeight),
    height: toVirtualCoord(scaledHeight, canvasHeight),
    rotation: obj.angle || 0,
    opacity: obj.opacity || 1,
    flipX: obj.flipX || false,
    flipY: obj.flipY || false,
    scaleX: 1, // Normalized
    scaleY: 1,
    maskLeft: 0,
    maskTop: 0,
    maskWidth: 0,
    maskHeight: 0
  };

  // Extract absolute mask coordinates if present
  if (obj.clipPath && obj.clipPath.name === 'cropMask') {
    const cp = obj.clipPath as Rect;
    transform.maskLeft = toVirtualCoord(cp.left!, canvasHeight);
    transform.maskTop = toVirtualCoord(cp.top!, canvasHeight);
    transform.maskWidth = toVirtualCoord(cp.width!, canvasHeight);
    transform.maskHeight = toVirtualCoord(cp.height!, canvasHeight);
  }

  return transform;
};

/**
 * Centers an object on the canvas.
 */
export const centerObject = (canvas: Canvas, obj: FabricObject) => {
  const center = canvas.getCenterPoint();
  obj.set({
    left: center.x,
    top: center.y
  });
  obj.setCoords();
};

/**
 * Exports the canvas as a high-resolution PNG.
 */
export const exportCanvasToImage = (canvas: Canvas): string => {
  return canvas.toDataURL({
    format: 'png',
    multiplier: 2
  });
};
