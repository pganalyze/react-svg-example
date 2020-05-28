import React from 'react';

export const Translate: React.FC<{x?: number, y?: number}> = ({x=0,y=0,children}) => {
  if (!x && !y) return children as React.ReactElement;
  return <g transform={`translate(${x},${y})`}>{children}</g>;
}
