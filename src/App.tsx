import React from 'react';

import { generateData } from './util';
import { Chart } from './svg/Chart';

export const App: React.FC = () => {
  const data = generateData(20);

  return (
    <Chart data={data} />
  )
}

export default App;
