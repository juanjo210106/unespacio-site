import React from 'react';
import type { StudioElement } from './types';

interface CanvasElementProps {
  element: StudioElement;
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent, id: string, action: string) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({ element, isSelected, onPointerDown }) => {
  const { id, type, category, x, y, width, height, rotation, color, texture, shape, pathData } = element;

  const fillValue = texture || color;
  
  // Decide if element should have drop shadow (usually furniture, structures, trees)
  const hasShadow = category === 'Estructuras' || category === 'Mobiliario' || category === 'Vegetación';
  const filterUrl = hasShadow ? (category === 'Estructuras' ? 'url(#drop-shadow-high)' : 'url(#drop-shadow)') : undefined;

  const renderComplexShape = () => {
    switch(type) {
      case 'tree':
        return (
          <g>
            {/* Trunk */}
            <circle cx={width/2} cy={height/2} r={width/10} fill="#78350f" />
            {/* Foliage layers */}
            <circle cx={width/2} cy={height/2} r={width/2} fill={color} opacity="0.8" />
            <circle cx={width/2 - width/10} cy={height/2 - height/10} r={width/2.5} fill="#4ade80" opacity="0.6" />
            <circle cx={width/2 + width/8} cy={height/2 + height/8} r={width/3} fill="#166534" opacity="0.4" />
          </g>
        );
      case 'bush':
        return (
          <g>
            <path d={`M${width/2},0 Q${width},0 ${width},${height/2} Q${width},${height} ${width/2},${height} Q0,${height} 0,${height/2} Q0,0 ${width/2},0 Z`} fill={color} />
            <circle cx={width/2} cy={height/2} r={width/3} fill="#4ade80" opacity="0.4" />
          </g>
        );
      case 'table':
        return (
          <g>
            {/* Chairs */}
            <rect x={10} y={-10} width={20} height={15} rx={4} fill="#d6d3d1" />
            <rect x={width - 30} y={-10} width={20} height={15} rx={4} fill="#d6d3d1" />
            <rect x={10} y={height - 5} width={20} height={15} rx={4} fill="#d6d3d1" />
            <rect x={width - 30} y={height - 5} width={20} height={15} rx={4} fill="#d6d3d1" />
            {/* Table top */}
            <rect x={0} y={0} width={width} height={height} rx={4} fill={color} stroke="#292524" strokeWidth="2" />
          </g>
        );
      case 'hammock':
        return (
          <g>
            {/* Frame */}
            <rect x={0} y={0} width={width} height={height} rx={8} fill="#e7e5e4" stroke="#a8a29e" strokeWidth="2" />
            {/* Mattress */}
            <rect x={4} y={4} width={width - 8} height={height - 8} rx={6} fill={color} />
            {/* Pillow */}
            <rect x={8} y={8} width={width - 16} height={15} rx={4} fill="#ffffff" opacity="0.8" />
          </g>
        );
      case 'chillout':
        return (
          <g>
            {/* Base */}
            <rect x={0} y={0} width={width} height={height} fill="#d6d3d1" />
            {/* Cushions */}
            <rect x={5} y={5} width={width - 10} height={height - 30} rx={4} fill={color} stroke="#e5e7eb" strokeWidth="1" />
            <rect x={5} y={height - 20} width={(width - 15) / 2} height={15} rx={2} fill={color} />
            <rect x={width/2 + 2.5} y={height - 20} width={(width - 15) / 2} height={15} rx={2} fill={color} />
          </g>
        );
      case 'pergola':
        return (
          <g>
            {/* Posts */}
            <rect x={0} y={0} width={10} height={10} fill="#44403c" />
            <rect x={width-10} y={0} width={10} height={10} fill="#44403c" />
            <rect x={0} y={height-10} width={10} height={10} fill="#44403c" />
            <rect x={width-10} y={height-10} width={10} height={10} fill="#44403c" />
            {/* Beams */}
            {[...Array(Math.floor(width/15))].map((_, i) => (
               <rect key={i} x={i * 15} y={0} width={4} height={height} fill={color} opacity="0.8" />
            ))}
          </g>
        );
      default:
        return <rect width={width} height={height} fill={color} />;
    }
  };

  return (
    <g 
      transform={`translate(${x}, ${y}) rotate(${rotation}, ${width/2}, ${height/2})`}
      onPointerDown={(e) => onPointerDown(e, id, 'drag')}
      className="cursor-move group"
      filter={filterUrl}
    >
      {/* Element Shape */}
      {shape === 'rect' && (
        <rect width={width} height={height} fill={fillValue} stroke={isSelected ? '#01488E' : '#9ca3af'} strokeWidth={isSelected ? 2 : 1} rx={category === 'Suelos' ? 0 : 4} />
      )}
      {shape === 'circle' && (
        <ellipse cx={width/2} cy={height/2} rx={width/2} ry={height/2} fill={fillValue} stroke={isSelected ? '#01488E' : '#9ca3af'} strokeWidth={isSelected ? 2 : 1} />
      )}
      {shape === 'complex' && renderComplexShape()}
      {shape === 'path' && pathData && (
        <path d={pathData} fill={fillValue} stroke={isSelected ? '#01488E' : '#9ca3af'} strokeWidth={isSelected ? 2 : 1} transform={`scale(${width/100}, ${height/100})`} />
      )}

      {/* Selection Overlay & Handles */}
      {isSelected && (
        <>
          <rect width={width} height={height} fill="none" stroke="#01488E" strokeWidth="2" strokeDasharray="4" />
          
          {/* Resize Handle BR */}
          <circle 
            cx={width} cy={height} r="6" fill="#FFF" stroke="#01488E" strokeWidth="2"
            className="cursor-se-resize"
            onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e, id, 'resize-br'); }}
          />
          
          {/* Rotate Handle Top Center */}
          <line x1={width/2} y1={0} x2={width/2} y2={-20} stroke="#01488E" strokeWidth="2" />
          <circle 
            cx={width/2} cy={-20} r="6" fill="#FFF" stroke="#01488E" strokeWidth="2"
            className="cursor-crosshair"
            onPointerDown={(e) => { e.stopPropagation(); onPointerDown(e, id, 'rotate'); }}
          />

          {/* Cotas (Medidas) */}
          <g className="opacity-80 pointer-events-none" transform={`rotate(${-rotation}, ${width/2}, ${height/2})`}>
            {/* Cota Superior (Ancho) */}
            <line x1={0} y1={-15} x2={width} y2={-15} stroke="#01488E" strokeWidth="1" />
            <line x1={0} y1={-18} x2={0} y2={-12} stroke="#01488E" strokeWidth="1" />
            <line x1={width} y1={-18} x2={width} y2={-12} stroke="#01488E" strokeWidth="1" />
            <rect x={width/2 - 20} y={-23} width={40} height={16} fill="#FAFAFA" rx={2} />
            <text x={width/2} y={-11} fontSize="10" fill="#01488E" textAnchor="middle" fontWeight="bold">
              {(width/20).toFixed(1)}m
            </text>

            {/* Cota Derecha (Alto) */}
            <line x1={width + 15} y1={0} x2={width + 15} y2={height} stroke="#01488E" strokeWidth="1" />
            <line x1={width + 12} y1={0} x2={width + 18} y2={0} stroke="#01488E" strokeWidth="1" />
            <line x1={width + 12} y1={height} x2={width + 18} y2={height} stroke="#01488E" strokeWidth="1" />
            <rect x={width + 7} y={height/2 - 20} width={16} height={40} fill="#FAFAFA" rx={2} />
            <text x={width + 15} y={height/2} fontSize="10" fill="#01488E" textAnchor="middle" fontWeight="bold" transform={`rotate(90, ${width + 15}, ${height/2})`}>
              {(height/20).toFixed(1)}m
            </text>
          </g>
        </>
      )}
    </g>
  );
};
