
import React from 'react';
import { Plus, Trash2, MoveHorizontal, Palette, Type, Navigation, Layers, Waypoints, Maximize2 } from 'lucide-react';
import { LabelPosition } from '../types';

interface SidebarProps {
  selectedElement: any | null;
  onAddStation: () => void;
  onDelete: (id: string) => void;
  onUpdateNode: (id: string, data: any) => void;
  onUpdateEdge: (id: string, data: any) => void;
}

const LINE_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#64748b', // Slate
];

const ROUTING_STYLES = [
  { label: 'Smooth', value: 'smoothstep' },
  { label: 'Step', value: 'step' },
  { label: 'Straight', value: 'straight' },
  { label: 'Bezier', value: 'default' },
];

const Sidebar: React.FC<SidebarProps> = ({
  selectedElement,
  onAddStation,
  onDelete,
  onUpdateNode,
  onUpdateEdge
}) => {
  const isNode = selectedElement?.data && !selectedElement.source;
  const isEdge = selectedElement?.source;

  return (
    <div className="w-80 h-full bg-white border-l border-slate-200 shadow-xl p-6 overflow-y-auto z-10">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Navigation className="w-5 h-5 text-blue-600" />
        Map Editor
      </h2>

      <div className="space-y-6">
        <section>
          <button
            onClick={onAddStation}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add New Station
          </button>
        </section>

        <hr className="border-slate-100" />

        {selectedElement ? (
          <section className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-700 uppercase text-xs tracking-wider">
                Editing {isNode ? 'Station' : 'Line'}
              </h3>
              <button
                onClick={() => onDelete(selectedElement.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Delete Selected"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Label Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-500 flex items-center gap-1">
                <Type className="w-4 h-4" /> Name / Label
              </label>
              <input
                type="text"
                value={selectedElement.data.label || ''}
                onChange={(e) => {
                  if (isNode) onUpdateNode(selectedElement.id, { label: e.target.value });
                  else onUpdateEdge(selectedElement.id, { label: e.target.value });
                }}
                className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter text..."
              />
            </div>

            {isNode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 flex items-center gap-1">
                  <MoveHorizontal className="w-4 h-4" /> Label Position
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(LabelPosition).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => onUpdateNode(selectedElement.id, { labelPosition: pos })}
                      className={`px-3 py-2 text-xs rounded-md border capitalize transition-all ${selectedElement.data.labelPosition === pos
                        ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isEdge && (
              <>
                {/* Primary Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-1">
                    <Palette className="w-4 h-4" /> {selectedElement.data.isDouble ? 'Primary Color' : 'Line Color'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LINE_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => onUpdateEdge(selectedElement.id, { color })}
                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedElement.data.color === color ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent'
                          }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Secondary Color (Conditional) */}
                {selectedElement.data.isDouble && (
                  <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-medium text-slate-500 flex items-center gap-1">
                      <Palette className="w-4 h-4" /> Secondary Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {LINE_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => onUpdateEdge(selectedElement.id, { color2: color })}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selectedElement.data.color2 === color ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent'
                            }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Routing Style */}
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-1">
                    <Waypoints className="w-4 h-4" /> Routing / Arah Line
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROUTING_STYLES.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => onUpdateEdge(selectedElement.id, { routingStyle: style.value })}
                        className={`px-3 py-2 text-xs rounded-md border transition-all ${(selectedElement.data.routingStyle || 'smoothstep') === style.value
                          ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">Double Line Style</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedElement.data.isDouble || false}
                      onChange={(e) => onUpdateEdge(selectedElement.id, { isDouble: e.target.checked })}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Double Gap Slider */}
                  {selectedElement.data.isDouble && (
                    <div className="p-3 bg-slate-50 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
                          <Maximize2 className="w-4 h-4" /> Line Gap
                        </label>
                        <span className="text-xs font-bold text-blue-600">{selectedElement.data.doubleGap || 6}px</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="24"
                        step="2"
                        value={selectedElement.data.doubleGap || 6}
                        onChange={(e) => onUpdateEdge(selectedElement.id, { doubleGap: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-600">Show Direction (Arrow)</span>
                    <input
                      type="checkbox"
                      checked={selectedElement.data.hasArrow}
                      onChange={(e) => onUpdateEdge(selectedElement.id, { hasArrow: e.target.checked })}
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </section>
        ) : (
          <div className="py-10 text-center text-slate-400 space-y-2">
            <Navigation className="w-12 h-12 mx-auto opacity-20" />
            <p className="text-sm">Select a station or line to edit its properties</p>
          </div>
        )}
      </div>

      {/* <div className="absolute bottom-6 left-6 right-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-[10px] uppercase font-bold text-blue-800 tracking-widest mb-1">Shortcut Tip</p>
        <p className="text-xs text-blue-700 leading-relaxed">
          Gunakan slider "Line Gap" untuk memisahkan jalur kereta yang berjalan sejajar.
        </p>
      </div> */}
    </div>
  );
};

export default Sidebar;
