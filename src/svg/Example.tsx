import React from 'react';

import { generateData } from '../util';
import { Chart } from './Chart';

export const Example: React.FC = () => {
  // Generate some dummy data as { x, y } points. For your actual data representation,
  // you may want something more compact (like arrays of [ x, y ] pairs).
  const data = generateData(20);

  return (
    <Chart data={data} />
  )
}
