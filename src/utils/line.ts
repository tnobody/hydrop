export interface Point {
  x: number;
  y: number;
}

export type SvgPathCommand = (
  point: Point,
  i: number,
  points: Point[]
) => string;

export const svgPath = (points: Point[], command: SvgPathCommand) => {
  return points.reduce(
    (acc, point, i, a) =>
      i === 0
        ? // if first point
          `M ${point.x},${point.y}`
        : // else
          `${acc} ${command(point, i, a)}`,
    ""
  );
};
export const lineCommand = (point: Point) => `L ${point.x} ${point.y}`;

export const line = (pointA: Point, pointB: Point) => {
  const lengthX = pointB.x - pointA.x;
  const lengthY = pointB.y - pointA.y;
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  };
};

export const controlPoint = (
  current: Point,
  previous?: Point,
  next?: Point,
  reverse = false
) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current;
  const n = next || current;
  // The smoothing ratio
  const smoothing = 0.2;
  // Properties of the opposed-line
  const o = line(p, n);
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;
  // The control point position is relative to the current point
  const x = current.x + Math.cos(angle) * length;
  const y = current.y + Math.sin(angle) * length;
  return { x, y };
};

export const bezierCommand = (point: Point, i: number, a: Point[]) => {
  // start control point
  const { x: cpsX, y: cpsY } = controlPoint(a[i - 1], a[i - 2], point);
  // end control point
  const { x: cpeX, y: cpeY } = controlPoint(point, a[i - 1], a[i + 1], true);
  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
};
