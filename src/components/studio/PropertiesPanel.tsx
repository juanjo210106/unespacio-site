import React from 'react';
import type { StudioElement, StudioAction } from './types';
import { Trash2, MoveUp, MoveDown, Maximize, RotateCw } from 'lucide-react';

interface PropertiesPanelProps {
  element: StudioElement | null;
  dispatch: React.Dispatch<StudioAction>;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ element, dispatch }) => {
  if (!element) {
    return (
      <div className="w-64 bg-[#FAFAFA] border-l border-gray-200 h-full p-6 text-center text-gray-400 font-sans flex flex-col justify-center items-center">
        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg mb-4"></div>
        <p className="text-sm">Selecciona un elemento para editar sus propiedades</p>
      </div>
    );
  }

  const handleChange = (field: keyof StudioElement, value: string | number) => {
    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: { id: element.id, [field]: value }
    });
  };

  return (
    <div className="w-64 bg-[#FAFAFA] border-l border-gray-200 h-full p-5 font-sans overflow-y-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h3 className="font-bold text-[#111827]">{element.name}</h3>
        <button 
          onClick={() => dispatch({ type: 'REMOVE_ELEMENT', payload: element.id })}
          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
          title="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Dimensiones */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Maximize size={12} /> Dimensiones (m)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">Ancho</span>
              <input 
                type="number" 
                value={element.width / 20} 
                onChange={(e) => handleChange('width', Number(e.target.value) * 20)}
                className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#01488E]"
              />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block mb-1">Largo</span>
              <input 
                type="number" 
                value={element.height / 20} 
                onChange={(e) => handleChange('height', Number(e.target.value) * 20)}
                className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#01488E]"
              />
            </div>
          </div>
        </div>

        {/* Rotación */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <RotateCw size={12} /> Rotación (grados)
          </label>
          <input 
            type="number" 
            value={element.rotation} 
            onChange={(e) => handleChange('rotation', Number(e.target.value))}
            className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-[#01488E]"
          />
        </div>

        {/* Color */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
            Color / Material
          </label>
          <div className="flex items-center gap-3">
            <input 
              type="color" 
              value={element.color} 
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-gray-300"
            />
            <span className="text-sm text-gray-600 uppercase font-mono">{element.color}</span>
          </div>
        </div>

        {/* Capas */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
            Capas (Z-Index)
          </label>
          <div className="flex gap-2">
            <button 
              onClick={() => dispatch({ type: 'BRING_FORWARD', payload: element.id })}
              className="flex-1 flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <MoveUp size={14} /> Subir
            </button>
            <button 
              onClick={() => dispatch({ type: 'SEND_BACKWARD', payload: element.id })}
              className="flex-1 flex items-center justify-center gap-2 p-2 bg-white border border-gray-200 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
            >
              <MoveDown size={14} /> Bajar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
