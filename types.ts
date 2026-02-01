
export interface StationNodeData {
  label: string;
  labelPosition: 'top' | 'bottom' | 'left' | 'right';
  icon: 'Warehouse' | 'ShieldCheck' | 'WarningOctagon';
}

export interface TransitEdgeData {
  label?: string;
  color: string;
  color2?: string; // Secondary color for double lines
  hasArrow: boolean;
  isDouble: boolean;
  doubleGap?: number; // Distance between the two lines
  routingStyle: 'smoothstep' | 'step' | 'straight' | 'default'; // default is Bezier
}

export enum LabelPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}
