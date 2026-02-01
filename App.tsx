
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  Node,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  MarkerType,
  ReactFlowProvider,
  Panel,
  BackgroundVariant
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import StationNode from './components/StationNode';
import DoubleEdge from './components/DoubleEdge';
import Sidebar from './components/Sidebar';
import { LabelPosition } from './types';

const nodeTypes = {
  station: StationNode,
};

const edgeTypes = {
  doubleEdge: DoubleEdge,
  // Mapping standard types to our floating implementation
  smoothstep: DoubleEdge,
  step: DoubleEdge,
  straight: DoubleEdge,
  default: DoubleEdge,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'station',
    position: { x: 100, y: 100 },
    data: { label: 'Manggarai', labelPosition: LabelPosition.BOTTOM },
  },
  {
    id: '2',
    type: 'station',
    position: { x: 400, y: 100 },
    data: { label: 'Jatinegara', labelPosition: LabelPosition.BOTTOM, icon: "ShieldCheck" },
  },
  {
    id: '3',
    type: 'station',
    position: { x: 100, y: 350 },
    data: { label: 'Depok', labelPosition: LabelPosition.LEFT, icon: 'Warehouse' },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    label: 'Red-Blue Express',
    data: { color: '#ef4444', color2: '#3b82f6', hasArrow: false, isDouble: true, doubleGap: 6, routingStyle: 'smoothstep' },
    type: 'doubleEdge',
  },
];

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e${uuidv4()}`,
        label: '',
        type: 'doubleEdge', // Use our custom floating edge by default
        data: { color: '#64748b', color2: '#334155', hasArrow: false, isDouble: false, doubleGap: 6, routingStyle: 'smoothstep' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );

  const addStation = useCallback(() => {
    const id = uuidv4();
    const newNode: Node = {
      id,
      type: 'station',
      position: { x: Math.random() * 400 + 50, y: Math.random() * 400 + 50 },
      data: { label: 'Station Name', labelPosition: LabelPosition.BOTTOM },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedId(id);
  }, []);

  const deleteElement = useCallback((id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.id !== id && e.source !== id && e.target !== id));
    setSelectedId(null);
  }, []);

  const updateNodeData = useCallback((id: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, []);

  const updateEdgeData = useCallback((id: string, newData: any) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          const updatedData = { ...edge.data, ...newData };

          const updatedEdge: Edge = {
            ...edge,
            type: 'doubleEdge', // Keep using our floating edge implementation
            data: updatedData,
            label: newData.label !== undefined ? newData.label : edge.label,
          };

          if (updatedData.hasArrow !== undefined) {
            updatedEdge.markerEnd = updatedData.hasArrow
              ? { type: MarkerType.ArrowClosed, color: updatedData.color || '#64748b' }
              : undefined;
          }

          return updatedEdge;
        }
        return edge;
      })
    );
  }, []);

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }: any) => {
    if (selectedNodes.length > 0) setSelectedId(selectedNodes[0].id);
    else if (selectedEdges.length > 0) setSelectedId(selectedEdges[0].id);
    else setSelectedId(null);
  }, []);

  const selectedElement = nodes.find(n => n.id === selectedId) || edges.find(e => e.id === selectedId);

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onSelectionChange={onSelectionChange}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: 'doubleEdge',
          }}
        >
          <Background variant={BackgroundVariant.Lines} color="#e2e8f0" gap={30} />
          <Controls className="bg-white shadow-lg border-none" />
          {/* <MiniMap
            className="bg-white border shadow-md rounded-lg overflow-hidden"
            nodeColor="#3b82f6"
            maskColor="rgba(241, 245, 249, 0.7)"
          /> */}

          <Panel position="top-left" className="m-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
              <h1 className="text-lg font-bold text-slate-800">Commuter Map Designer</h1>
              <p className="text-xs text-slate-500 font-medium">Build your transit network</p>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <Sidebar
        selectedElement={selectedElement}
        onAddStation={addStation}
        onDelete={deleteElement}
        onUpdateNode={updateNodeData}
        onUpdateEdge={updateEdgeData}
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);
