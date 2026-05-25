import { ClothingCategory, PersonaType, type ClothingTransform } from '../../types';

// Based on a virtual canvas height of 1000px (3:4 aspect ratio, so 750px width)
// x and y are the center of the object relative to the center of the canvas
export const DEFAULT_TRANSFORMS: Record<PersonaType, Record<ClothingCategory, ClothingTransform>> = {
  [PersonaType.MALE]: {
    [ClothingCategory.TOP]: { x: 375, y: 420, scaleX: 1, scaleY: 1, rotation: 0, width: 450, height: 450 },
    [ClothingCategory.BOTTOM]: { x: 375, y: 720, scaleX: 1, scaleY: 1, rotation: 0, width: 420, height: 650 },
    [ClothingCategory.SHOES]: { x: 375, y: 940, scaleX: 1, scaleY: 1, rotation: 0, width: 280, height: 180 },
    [ClothingCategory.JACKET]: { x: 375, y: 420, scaleX: 1, scaleY: 1, rotation: 0, width: 480, height: 480 },
    [ClothingCategory.DRESS]: { x: 375, y: 600, scaleX: 1, scaleY: 1, rotation: 0, width: 450, height: 850 },
    [ClothingCategory.ACCESSORY]: { x: 375, y: 250, scaleX: 1, scaleY: 1, rotation: 0, width: 150, height: 150 },
  },
  [PersonaType.FEMALE]: {
    [ClothingCategory.TOP]: { x: 375, y: 430, scaleX: 1, scaleY: 1, rotation: 0, width: 420, height: 420 },
    [ClothingCategory.BOTTOM]: { x: 375, y: 700, scaleX: 1, scaleY: 1, rotation: 0, width: 380, height: 620 },
    [ClothingCategory.SHOES]: { x: 375, y: 930, scaleX: 1, scaleY: 1, rotation: 0, width: 260, height: 160 },
    [ClothingCategory.JACKET]: { x: 375, y: 430, scaleX: 1, scaleY: 1, rotation: 0, width: 450, height: 450 },
    [ClothingCategory.DRESS]: { x: 375, y: 580, scaleX: 1, scaleY: 1, rotation: 0, width: 420, height: 820 },
    [ClothingCategory.ACCESSORY]: { x: 375, y: 260, scaleX: 1, scaleY: 1, rotation: 0, width: 140, height: 140 },
  },
};
