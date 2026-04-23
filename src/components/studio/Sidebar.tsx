import React, { useState } from 'react';
import type { CatalogItem, ElementCategory, StudioAction } from './types';
import { Plus } from 'lucide-react';

const CATALOG: CatalogItem[] = [
  // Estructuras
  { type: 'pool', category: 'Estructuras', name: 'Piscina Rectangular', defaultWidth: 80, defaultHeight: 160, defaultColor: '#38bdf8', texture: 'url(#tex-water)', shape: 'rect', costPerSqM: 300 },
  { type: 'pool_round', category: 'Estructuras', name: 'Piscina Redonda', defaultWidth: 100, defaultHeight: 100, defaultColor: '#38bdf8', texture: 'url(#tex-water)', shape: 'circle', costPerSqM: 350 },
  { type: 'pergola', category: 'Estructuras', name: 'Pérgola', defaultWidth: 120, defaultHeight: 120, defaultColor: '#d6d3d1', shape: 'complex', costPerSqM: 150 },
  { type: 'shed', category: 'Estructuras', name: 'Caseta', defaultWidth: 80, defaultHeight: 60, defaultColor: '#78716c', shape: 'rect', costPerSqM: 200 },
  // Suelos
  { type: 'grass', category: 'Suelos', name: 'Césped', defaultWidth: 200, defaultHeight: 200, defaultColor: '#86efac', texture: 'url(#tex-grass)', shape: 'rect', costPerSqM: 15 },
  { type: 'deck', category: 'Suelos', name: 'Tarima Madera', defaultWidth: 100, defaultHeight: 100, defaultColor: '#b45309', texture: 'url(#tex-wood)', shape: 'rect', costPerSqM: 60 },
  { type: 'stone', category: 'Suelos', name: 'Grava/Piedra', defaultWidth: 100, defaultHeight: 100, defaultColor: '#e7e5e4', shape: 'rect', costPerSqM: 25 },
  { type: 'paving', category: 'Suelos', name: 'Pavimento', defaultWidth: 100, defaultHeight: 100, defaultColor: '#a8a29e', texture: 'url(#tex-paving)', shape: 'rect', costPerSqM: 40 },
  // Vegetación
  { type: 'tree', category: 'Vegetación', name: 'Árbol', defaultWidth: 80, defaultHeight: 80, defaultColor: '#22c55e', shape: 'complex', fixedCost: 80 },
  { type: 'bush', category: 'Vegetación', name: 'Arbusto', defaultWidth: 40, defaultHeight: 40, defaultColor: '#16a34a', shape: 'complex', fixedCost: 25 },
  { type: 'hedge', category: 'Vegetación', name: 'Seto Modular', defaultWidth: 100, defaultHeight: 20, defaultColor: '#15803d', texture: 'url(#tex-grass)', shape: 'rect', costPerSqM: 45 },
  // Mobiliario
  { type: 'table', category: 'Mobiliario', name: 'Mesa Exterior', defaultWidth: 80, defaultHeight: 60, defaultColor: '#44403c', shape: 'complex', fixedCost: 250 },
  { type: 'hammock', category: 'Mobiliario', name: 'Tumbona', defaultWidth: 40, defaultHeight: 80, defaultColor: '#fde047', shape: 'complex', fixedCost: 120 },
  { type: 'chillout', category: 'Mobiliario', name: 'Sofá Chill-out', defaultWidth: 100, defaultHeight: 80, defaultColor: '#f3f4f6', shape: 'complex', fixedCost: 600 },
];

const CATEGORIES: ElementCategory[] = ['Estructuras', 'Suelos', 'Vegetación', 'Mobiliario'];

interface SidebarProps {
  dispatch: React.Dispatch<StudioAction>;
}

export const Sidebar: React.FC<SidebarProps> = ({ dispatch }) => {
  const [openCategory, setOpenCategory] = useState<ElementCategory>('Estructuras');

  const handleAddItem = (item: CatalogItem) => {
    dispatch({
      type: 'ADD_ELEMENT',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        type: item.type,
        category: item.category,
        name: item.name,
        x: 100,
        y: 100,
        width: item.defaultWidth,
        height: item.defaultHeight,
        rotation: 0,
        color: item.defaultColor,
        texture: item.texture,
        zIndex: 1,
        shape: item.shape,
        costPerSqM: item.costPerSqM,
        fixedCost: item.fixedCost
      }
    });
  };

  return (
    <div className="w-72 bg-[#FAFAFA] border-r border-gray-200 h-full flex flex-col overflow-y-auto font-sans">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-bold text-[#111827] text-lg">Catálogo</h2>
        <p className="text-xs text-gray-500 mt-1">Arrastra o haz clic para añadir al lienzo</p>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {CATEGORIES.map(cat => (
          <div key={cat} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <button 
              className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center text-sm font-bold text-gray-700 hover:bg-gray-100"
              onClick={() => setOpenCategory(openCategory === cat ? ('' as ElementCategory) : cat)}
            >
              {cat}
              <span className="text-gray-400">{openCategory === cat ? '-' : '+'}</span>
            </button>
            
            {openCategory === cat && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {CATALOG.filter(c => c.category === cat).map(item => (
                  <button 
                    key={item.type}
                    onClick={() => handleAddItem(item)}
                    className="flex flex-col items-center justify-center p-3 border border-gray-100 rounded bg-gray-50 hover:bg-blue-50 hover:border-[#01488E] transition-colors group"
                  >
                    <svg 
                      width="32" height="32" viewBox="0 0 100 100" 
                      className="mb-2 rounded border border-gray-200 group-hover:border-[#01488E] bg-white drop-shadow-sm"
                    >
                      {item.texture && (
                        <defs>
                          <pattern id={`thumb-${item.type}`} width="40" height="40" patternUnits="userSpaceOnUse" href={`#tex-${item.texture.split('-')[1].replace(')','')}`} />
                        </defs>
                      )}
                      {item.shape === 'rect' ? (
                        <rect x="10" y="10" width="80" height="80" fill={item.texture ? `url(#tex-${item.texture.split('-')[1].replace(')','')})` : item.defaultColor} rx={item.category === 'Suelos' ? 0 : 4} />
                      ) : item.shape === 'circle' ? (
                        <circle cx="50" cy="50" r="40" fill={item.texture ? `url(#tex-${item.texture.split('-')[1].replace(')','')})` : item.defaultColor} />
                      ) : (
                        <path d="M 20 20 L 80 20 L 80 80 L 20 80 Z" fill={item.defaultColor} stroke="#9ca3af" strokeWidth="2" strokeDasharray="4" />
                      )}
                    </svg>
                    <span className="text-[10px] text-center font-medium text-gray-600 leading-tight">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AdSense Slot Placeholder */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="w-full h-[250px] bg-gray-200 flex flex-col items-center justify-center border border-gray-300 text-gray-400 text-xs text-center p-4">
          <span>AdSense Space (300x250)</span>
          <span className="mt-2 block opacity-70">El bloque de anuncios no causará CLS porque el contenedor tiene altura fija.</span>
        </div>
      </div>
    </div>
  );
};
