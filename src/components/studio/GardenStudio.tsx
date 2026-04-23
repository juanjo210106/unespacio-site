import React, { useReducer } from 'react';
import { studioReducer, initialState } from './store';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';

export const GardenStudio: React.FC = () => {
  const [state, dispatch] = useReducer(studioReducer, initialState);

  const selectedElement = state.selectedId 
    ? state.elements.find(el => el.id === state.selectedId) || null 
    : null;

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
      <Toolbar state={state} dispatch={dispatch} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Tools & Ads */}
        <Sidebar dispatch={dispatch} />

        {/* Central Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gray-200">
          <Canvas elements={state.elements} selectedId={state.selectedId} dispatch={dispatch} />
        </div>

        {/* Right Sidebar: Properties */}
        <PropertiesPanel element={selectedElement} dispatch={dispatch} />
      </div>
    </div>
  );
};

export default GardenStudio;
