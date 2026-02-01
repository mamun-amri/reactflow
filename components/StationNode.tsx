
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { StationNodeData, LabelPosition } from '../types';
import { ShieldCheckIcon, WarehouseIcon, WarningOctagonIcon } from '@phosphor-icons/react';

const StationNode = ({ data, selected }: NodeProps<StationNodeData>) => {
  const getLabelStyle = () => {
    switch (data.labelPosition) {
      case LabelPosition.TOP:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2 text-center';
      case LabelPosition.LEFT:
        return 'right-full mr-3 top-1/2 -translate-y-1/2 text-right';
      case LabelPosition.RIGHT:
        return 'left-full ml-3 top-1/2 -translate-y-1/2 text-left';
      case LabelPosition.BOTTOM:
      default:
        return 'top-full mt-2 left-1/2 -translate-x-1/2 text-center';
    }
  };

  const IconLabel = ({ className }: { className?: string }) => {
    switch (data.icon) {
      case "Warehouse":
        return <WarehouseIcon className={className} />
      case "ShieldCheck":
        return <ShieldCheckIcon className={className} />
      case "WarningOctagon":
        return <WarningOctagonIcon className={className} />
      default:
        return <WarehouseIcon className={className} />
    }
  }

  return (

    <div className={`relative flex items-center justify-center w-10 h-10 transition-all ${selected ? 'scale-110' : ''}`}>
      {/* Background Container */}
      <div className={`
        w-full h-full rounded-md flex items-center justify-center 
        ${selected ? 'bg-blue-600 shadow-lg ring-2 ring-blue-300' : 'bg-blue-100 shadow-sm'}
        border border-blue-200 transition-colors
      `}>
        {/* Icon */}
        <IconLabel
          className={`w-6 h-6 ${selected ? 'text-white' : 'text-blue-800'}`}
        />
      </div>

      {/* Label */}
      <div className={`absolute whitespace-nowrap font-bold text-sm text-slate-700 pointer-events-none ${getLabelStyle()}`}>
        {data.label}
      </div>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 group-hover:opacity-100" />
      <Handle type="target" position={Position.Left} className="opacity-0 group-hover:opacity-100" />
      <Handle type="source" position={Position.Right} className="opacity-0 group-hover:opacity-100" />
    </div>
  );
};

export default memo(StationNode);
