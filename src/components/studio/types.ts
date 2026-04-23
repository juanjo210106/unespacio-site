export type ElementCategory = 'Estructuras' | 'Suelos' | 'Vegetación' | 'Mobiliario';

export interface CatalogItem {
  type: string;
  category: ElementCategory;
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultColor: string;
  texture?: string;
  costPerSqM?: number;
  fixedCost?: number;
  shape: 'rect' | 'circle' | 'ellipse' | 'path' | 'complex';
  pathData?: string;
}

export interface StudioElement {
  id: string;
  type: string;
  category: ElementCategory;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  texture?: string;
  zIndex: number;
  costPerSqM?: number;
  fixedCost?: number;
  shape: 'rect' | 'circle' | 'ellipse' | 'path' | 'complex';
  pathData?: string;
}

export interface StudioState {
  elements: StudioElement[];
  selectedId: string | null;
  history: StudioElement[][];
  historyIndex: number;
}

export type StudioAction = 
  | { type: 'ADD_ELEMENT'; payload: StudioElement }
  | { type: 'UPDATE_ELEMENT'; payload: Partial<StudioElement> & { id: string } }
  | { type: 'REMOVE_ELEMENT'; payload: string }
  | { type: 'SET_SELECTED'; payload: string | null }
  | { type: 'BRING_FORWARD'; payload: string }
  | { type: 'SEND_BACKWARD'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_CANVAS' };
