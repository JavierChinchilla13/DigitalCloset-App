import { ClothingCategory, PersonaType, type ClothingTransform } from '../../types';

// Based on a virtual canvas height of 1000px (3:4 aspect ratio, so 750px width)
export const DEFAULT_TRANSFORMS: Record<PersonaType, Record<ClothingCategory, ClothingTransform>> = {
  [PersonaType.MALE]: {
    [ClothingCategory.TOP]: { x: 0, y: -80, scale: 1, rotation: 0, width: 450, height: 450 },
    [ClothingCategory.BOTTOM]: { x: 0, y: 220, scale: 1, rotation: 0, width: 420, height: 650 },
    [ClothingCategory.SHOES]: { x: 0, y: 440, scale: 1, rotation: 0, width: 280, height: 180 },
    [ClothingCategory.JACKET]: { x: 0, y: -80, scale: 1, rotation: 0, width: 480, height: 480 },
    [ClothingCategory.DRESS]: { x: 0, y: 100, scale: 1, rotation: 0, width: 450, height: 850 },
    [ClothingCategory.ACCESSORY]: { x: 0, y: -250, scale: 1, rotation: 0, width: 150, height: 150 },
  },
  [PersonaType.FEMALE]: {
    [ClothingCategory.TOP]: { x: 0, y: -70, scale: 1, rotation: 0, width: 420, height: 420 },
    [ClothingCategory.BOTTOM]: { x: 0, y: 200, scale: 1, rotation: 0, width: 380, height: 620 },
    [ClothingCategory.SHOES]: { x: 0, y: 430, scale: 1, rotation: 0, width: 260, height: 160 },
    [ClothingCategory.JACKET]: { x: 0, y: -70, scale: 1, rotation: 0, width: 450, height: 450 },
    [ClothingCategory.DRESS]: { x: 0, y: 80, scale: 1, rotation: 0, width: 420, height: 820 },
    [ClothingCategory.ACCESSORY]: { x: 0, y: -240, scale: 1, rotation: 0, width: 140, height: 140 },
  },
};
