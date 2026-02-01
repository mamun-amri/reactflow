
import { Position, internalsSymbol, Node } from 'reactflow';

// returns the position (top, bottom, left, right) of a point relative to a center
function getParams(node: Node, target: Node) {
  const centerA = {
    x: node.position.x + (node.width ?? 0) / 2,
    y: node.position.y + (node.height ?? 0) / 2,
  };
  const centerB = {
    x: target.position.x + (target.width ?? 0) / 2,
    y: target.position.y + (target.height ?? 0) / 2,
  };

  const horizontalDiff = Math.abs(centerA.x - centerB.x);
  const verticalDiff = Math.abs(centerA.y - centerB.y);

  let position;

  // determine the intersection side
  if (horizontalDiff > verticalDiff) {
    position = centerA.x > centerB.x ? Position.Left : Position.Right;
  } else {
    position = centerA.y > centerB.y ? Position.Top : Position.Bottom;
  }

  const [x, y] = getIntersectionWithCenter(node, target);

  return [x, y, position] as const;
}

function getIntersectionWithCenter(node: Node, target: Node) {
  const { width: nodeW = 0, height: nodeH = 0, position: nodePos } = node;
  const { width: targetW = 0, height: targetH = 0, position: targetPos } = target;

  const nodeCenter = {
    x: nodePos.x + nodeW / 2,
    y: nodePos.y + nodeH / 2,
  };
  const targetCenter = {
    x: targetPos.x + targetW / 2,
    y: targetPos.y + targetH / 2,
  };

  // Simple intersection with the node's bounding box
  const w = nodeW / 2;
  const h = nodeH / 2;

  const dx = targetCenter.x - nodeCenter.x;
  const dy = targetCenter.y - nodeCenter.y;

  if (dx === 0 && dy === 0) return [nodeCenter.x, nodeCenter.y];

  const slope = dy / dx;

  // Check which side it intersects
  if (Math.abs(slope) > h / w) {
    // Intersects top or bottom
    const ySign = dy > 0 ? 1 : -1;
    return [nodeCenter.x + (ySign * h) / slope, nodeCenter.y + ySign * h];
  } else {
    // Intersects left or right
    const xSign = dx > 0 ? 1 : -1;
    return [nodeCenter.x + xSign * w, nodeCenter.y + xSign * w * slope];
  }
}

export function getEdgeParams(source: Node, target: Node) {
  const [sx, sy, sourcePos] = getParams(source, target);
  const [tx, ty, targetPos] = getParams(target, source);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
}
