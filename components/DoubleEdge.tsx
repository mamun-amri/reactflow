
import React from 'react';
import {
  EdgeProps,
  getSmoothStepPath,
  getBezierPath,
  getStraightPath,
  EdgeLabelRenderer,
  useNodes
} from 'reactflow';
import { getEdgeParams } from '../utils';

const DoubleEdge = ({
  id,
  source,
  target,
  style = {},
  markerEnd,
  label,
  data,
}: EdgeProps) => {
  const nodes = useNodes();
  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const routingStyle = data?.routingStyle || 'smoothstep';

  const getPathParams = {
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: targetPos,
  };

  let edgePath: string;
  let labelX: number;
  let labelY: number;

  switch (routingStyle) {
    case 'step':
      [edgePath, labelX, labelY] = getSmoothStepPath({ ...getPathParams, borderRadius: 0 });
      break;
    case 'straight':
      [edgePath, labelX, labelY] = getStraightPath(getPathParams);
      break;
    case 'default':
      [edgePath, labelX, labelY] = getBezierPath(getPathParams);
      break;
    case 'smoothstep':
    default:
      [edgePath, labelX, labelY] = getSmoothStepPath(getPathParams);
      break;
  }

  const color1 = data?.color || '#64748b';
  const color2 = data?.color2 || color1;
  const isDouble = data?.isDouble;
  const gap = data?.doubleGap || 6;
  const offset = gap / 2;

  return (
    <>
      {/* Background interaction path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.max(20, gap + 10)}
        className="react-flow__edge-interaction"
      />

      {isDouble ? (
        <>
          {/* First Line */}
          <path
            style={{ ...style, stroke: color1, strokeWidth: 4, fill: 'none', strokeLinecap: 'round' }}
            className="react-flow__edge-path"
            d={edgePath}
            transform={`translate(-${offset}, -${offset})`}
            markerEnd={markerEnd}
          />
          {/* Second Line */}
          <path
            style={{ ...style, stroke: color2, strokeWidth: 4, fill: 'none', strokeLinecap: 'round' }}
            className="react-flow__edge-path"
            d={edgePath}
            transform={`translate(${offset}, ${offset})`}
          />
        </>
      ) : (
        <path
          style={{ ...style, stroke: color1, strokeWidth: 4, fill: 'none', strokeLinecap: 'round' }}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
      )}

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="bg-white px-2 py-1 rounded shadow-sm border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-tighter whitespace-nowrap z-50"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default DoubleEdge;
