import type { StudioState, StudioAction, StudioElement } from './types';

export const initialState: StudioState = {
  elements: [],
  selectedId: null,
  history: [[]],
  historyIndex: 0,
};

const saveToHistory = (state: StudioState, newElements: StudioElement[]): StudioState => {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(newElements);
  return {
    ...state,
    elements: newElements,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

export const studioReducer = (state: StudioState, action: StudioAction): StudioState => {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const newElements = [...state.elements, action.payload];
      return saveToHistory(state, newElements);
    }
    case 'UPDATE_ELEMENT': {
      const newElements = state.elements.map(el => 
        el.id === action.payload.id ? { ...el, ...action.payload } : el
      );
      // We don't save to history on EVERY single pixel drag to avoid huge history, 
      // but for simplicity in this implementation we'll save it. 
      // A better approach is to save history on drag END, but for now we'll just update.
      // To avoid massive history, let's just update the state directly if it's a drag, 
      // but the reducer doesn't know. Let's assume UPDATE_ELEMENT saves history.
      return saveToHistory(state, newElements);
    }
    case 'REMOVE_ELEMENT': {
      const newElements = state.elements.filter(el => el.id !== action.payload);
      return saveToHistory({ ...state, selectedId: state.selectedId === action.payload ? null : state.selectedId }, newElements);
    }
    case 'SET_SELECTED':
      return { ...state, selectedId: action.payload };
    case 'BRING_FORWARD': {
      const elIdx = state.elements.findIndex(e => e.id === action.payload);
      if (elIdx < 0) return state;
      const newElements = [...state.elements];
      newElements[elIdx].zIndex += 1;
      // Sort by zIndex to keep rendering order logical if needed, though SVG relies on DOM order.
      // We will sort them by zIndex for DOM rendering.
      newElements.sort((a, b) => a.zIndex - b.zIndex);
      return saveToHistory(state, newElements);
    }
    case 'SEND_BACKWARD': {
      const elIdx = state.elements.findIndex(e => e.id === action.payload);
      if (elIdx < 0) return state;
      const newElements = [...state.elements];
      newElements[elIdx].zIndex -= 1;
      newElements.sort((a, b) => a.zIndex - b.zIndex);
      return saveToHistory(state, newElements);
    }
    case 'UNDO': {
      if (state.historyIndex > 0) {
        return {
          ...state,
          historyIndex: state.historyIndex - 1,
          elements: state.history[state.historyIndex - 1],
          selectedId: null,
        };
      }
      return state;
    }
    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          historyIndex: state.historyIndex + 1,
          elements: state.history[state.historyIndex + 1],
          selectedId: null,
        };
      }
      return state;
    }
    case 'CLEAR_CANVAS': {
      return saveToHistory({ ...state, selectedId: null }, []);
    }
    default:
      return state;
  }
};
