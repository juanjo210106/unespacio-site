import React, { useRef, useState, useEffect } from 'react';
import type { StudioElement, StudioAction } from './types';
import { CanvasElement } from './CanvasElement';

interface CanvasProps {
  elements: StudioElement[];
  selectedId: string | null;
  dispatch: React.Dispatch<StudioAction>;
}

const GRID_SIZE = 20; // 1 square = 1 meter = 20px

export const Canvas: React.FC<CanvasProps> = ({ elements, selectedId, dispatch }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [interaction, setInteraction] = useState<{
    id: string;
    action: string;
    startX: number;
    startY: number;
    startElemX: number;
    startElemY: number;
    startElemW: number;
    startElemH: number;
    startElemRot: number;
  } | null>(null);

  const snapToGrid = (val: number) => Math.round(val / GRID_SIZE) * GRID_SIZE;

  const getPointerPos = (e: React.PointerEvent | PointerEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    return {
      x: (e.clientX - CTM.e) / CTM.a,
      y: (e.clientY - CTM.f) / CTM.d
    };
  };

  const handlePointerDownElement = (e: React.PointerEvent, id: string, action: string) => {
    e.stopPropagation();
    const pos = getPointerPos(e);
    const el = elements.find(el => el.id === id);
    if (!el) return;

    dispatch({ type: 'SET_SELECTED', payload: id });
    setInteraction({
      id,
      action,
      startX: pos.x,
      startY: pos.y,
      startElemX: el.x,
      startElemY: el.y,
      startElemW: el.width,
      startElemH: el.height,
      startElemRot: el.rotation
    });
    
    // Capture pointer to track outside SVG if needed
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerDownBg = (e: React.PointerEvent) => {
    dispatch({ type: 'SET_SELECTED', payload: null });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!interaction) return;
    const pos = getPointerPos(e);
    const dx = pos.x - interaction.startX;
    const dy = pos.y - interaction.startY;

    if (interaction.action === 'drag') {
      dispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
          id: interaction.id,
          x: snapToGrid(interaction.startElemX + dx),
          y: snapToGrid(interaction.startElemY + dy)
        }
      });
    } else if (interaction.action === 'resize-br') {
      dispatch({
        type: 'UPDATE_ELEMENT',
        payload: {
          id: interaction.id,
          width: Math.max(GRID_SIZE, snapToGrid(interaction.startElemW + dx)),
          height: Math.max(GRID_SIZE, snapToGrid(interaction.startElemH + dy))
        }
      });
    } else if (interaction.action === 'rotate') {
      const el = elements.find(e => e.id === interaction.id);
      if(!el) return;
      // Calculate angle from center of element to pointer
      const centerX = interaction.startElemX + interaction.startElemW / 2;
      const centerY = interaction.startElemY + interaction.startElemH / 2;
      const angleRad = Math.atan2(pos.y - centerY, pos.x - centerX);
      let angleDeg = (angleRad * 180) / Math.PI + 90; // Adjust for Top-Center handle
      if(angleDeg < 0) angleDeg += 360;
      // Snap to 15 degrees
      angleDeg = Math.round(angleDeg / 15) * 15;
      
      dispatch({
        type: 'UPDATE_ELEMENT',
        payload: { id: interaction.id, rotation: angleDeg }
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (interaction) {
      (e.target as Element).releasePointerCapture(e.pointerId);
      setInteraction(null);
      // Here we could trigger a specific "SAVE_HISTORY" action if we managed history on drop instead of on every move.
    }
  };

  return (
    <svg 
      ref={svgRef}
      className="w-full h-full bg-[#FAFAFA] touch-none"
      onPointerDown={handlePointerDownBg}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <defs>
        {/* Grid Pattern */}
        <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
          <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#E5E7EB" strokeWidth="1" />
        </pattern>
        {/* Shadow Filter */}
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.15" />
        </filter>
        <filter id="drop-shadow-high" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="8" stdDeviation="6" floodOpacity="0.25" />
        </filter>

        {/* Textures */}
        <pattern id="tex-water" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#38bdf8" />
          <path d="M0 20 Q 10 10 20 20 T 40 20 M0 40 Q 10 30 20 40 T 40 40" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity="0.6"/>
        </pattern>
        
        <pattern id="tex-wood" width="20" height="100" patternUnits="userSpaceOnUse">
          <rect width="20" height="100" fill="#b45309" />
          <line x1="0" y1="0" x2="0" y2="100" stroke="#92400e" strokeWidth="2" />
          <line x1="20" y1="0" x2="20" y2="100" stroke="#92400e" strokeWidth="2" />
          <path d="M 5 20 Q 10 30 5 40 M 15 60 Q 10 70 15 80" fill="none" stroke="#92400e" strokeWidth="1" opacity="0.4"/>
        </pattern>

        <pattern id="tex-grass" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#86efac" />
          <circle cx="5" cy="5" r="1" fill="#4ade80" />
          <circle cx="15" cy="12" r="1.5" fill="#22c55e" />
          <circle cx="8" cy="18" r="1" fill="#4ade80" />
        </pattern>

        <pattern id="tex-paving" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#e7e5e4" />
          <path d="M 20 0 L 20 40 M 0 20 L 40 20" stroke="#d6d3d1" strokeWidth="2" />
          <rect x="2" y="2" width="16" height="16" fill="#f5f5f4" />
          <rect x="22" y="22" width="16" height="16" fill="#f5f5f4" />
        </pattern>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Elements - Sorted by zIndex */}
      {[...elements].sort((a,b) => a.zIndex - b.zIndex).map(el => (
        <CanvasElement 
          key={el.id} 
          element={el} 
          isSelected={selectedId === el.id}
          onPointerDown={handlePointerDownElement}
        />
      ))}
    </svg>
  );
};
