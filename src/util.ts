export type Datum = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Pos = {
  x: number;
  y: number;
};

export type Layout = {
  pos: Pos;
  size: Size;
};

export const generateData = (numPoints: number): Datum[] => {
  return Array(numPoints).fill(undefined).map((_,i) => {
    return {
      x: i,
      y: Math.sin(i / (numPoints - 1) * 2 * Math.PI)
    }
  });
}

export const formatPt = (pt: Datum) => {
  return `${pt.x},${pt.y.toFixed(2)}`
};
