import React from 'react';
import type { StudioAction, StudioState } from './types';
import { Undo2, Redo2, Download, Trash, Calculator } from 'lucide-react';

interface ToolbarProps {
  state: StudioState;
  dispatch: React.Dispatch<StudioAction>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ state, dispatch }) => {
  const handleExport = () => {
    // Simple export: in a real app, serialize state to JSON or convert SVG to PNG
    alert('Función de exportar a PDF/PNG (Requiere librería adicional o backend).');
  };

  // Calcula presupuesto: m2 = (width * height) / 400 (since 20px = 1m)
  const totalCost = state.elements.reduce((acc, el) => {
    let elCost = 0;
    if (el.fixedCost) {
      elCost += el.fixedCost;
    }
    if (el.costPerSqM) {
      const areaM2 = (el.width / 20) * (el.height / 20);
      // For circle it's Pi * r^2, but we approximate to rect for simplicity or calculate exactly
      const finalArea = el.shape === 'circle' ? Math.PI * Math.pow((el.width/2)/20, 2) : areaM2;
      elCost += finalArea * el.costPerSqM;
    }
    return acc + elCost;
  }, 0);

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-6 shadow-sm font-sans z-10 relative">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-[#01488E] hidden sm:block">Garden Studio 2D</h1>
        <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={state.historyIndex <= 0}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Deshacer"
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={state.historyIndex >= state.history.length - 1}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Rehacer"
          >
            <Redo2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Presupuesto */}
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-[#01488E]/20">
          <Calculator size={16} className="text-[#01488E]" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Presupuesto Est.</span>
            <span className="text-sm font-bold text-[#01488E]">{totalCost.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-300"></div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { if(confirm('¿Seguro que quieres limpiar todo el diseño?')) dispatch({ type: 'CLEAR_CANVAS' }); }}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors"
          >
            <Trash size={16} /> <span className="hidden sm:inline">Limpiar</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[#01488E] text-white hover:bg-blue-800 rounded text-sm font-medium transition-colors shadow-sm"
          >
            <Download size={16} /> <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
