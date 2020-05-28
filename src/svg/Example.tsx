import React, { useState } from 'react';

import styles from './style.module.css';

import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { line } from 'd3-shape';
import { generateData, Datum, Pos, Layout, formatPt } from '../util';
import { Mouse } from '../svg/Mouse';
import { Translate } from './Translate';
import { Sidebar } from './Sidebar';

export const Example: React.FC = () => {
  const viewBoxWidth = 400;
  const viewBoxHeight = 200;
  const paddingX = 6;
  const paddingY = 4;
  const tipY = 50;
  const sidebar: Layout = {
    pos: {
      x: paddingX,
      y: paddingY
    },
    size: {
      width: 50,
      height: viewBoxHeight - 2 * paddingY
    }
  }
  const body: Layout = {
    pos: {
      x: sidebar.pos.x + sidebar.size.width,
      y: paddingY
    },
    size: {
      width: viewBoxWidth - sidebar.size.width - 2 * paddingX,
      height: viewBoxHeight - 2 * paddingY,
    }
  }

  // Generate some dummy data as { x, y } points. For your actual data representation,
  // you may want something more compact (like arrays of [ x, y ] pairs).
  const data = generateData(20);

  // d3 scales let you map from your data domain to another domain (in this case, our
  // chart size). We need to cast these extents since they could be undefined if the
  // dataset is empty (we know it is not, because we're generating it).
  const xExtent = extent(data, d => d.x) as [ number, number ];
  const yExtent = extent(data, d => d.y) as [ number, number ];
  const xScale = scaleLinear().domain(xExtent).range([0,body.size.width]);
  const yScale = scaleLinear().domain(yExtent).range([0,body.size.height]);

  const linePath = line<Datum>()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))(data) as string;

  const [ clickPt, setClickPt ] = useState<Datum | undefined>(undefined);
  const handleClick = (pt: Datum) => {
    setClickPt(pt);
  }

  const mapToDataPoint = (mouse: Pos) => {
    // For larger datasets, consider d3-bisect https://observablehq.com/@d3/d3-bisect
    const closest = data.reduce((result, datum, idx) => {
      const thisDistance = Math.abs(mouse.x - xScale(datum.x));
      if (thisDistance < result.distance) {
        return {
          distance: thisDistance,
          index: idx,
        }
      } else {
        return result;
      }
    }, { distance: Infinity, index: -1 });

    return data[closest.index];
  }

  return (
    <svg width="100%" height="200px" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      <Translate {...body.pos}>
        <path
          className={styles.line}
          d={linePath}
        />
        <Mouse {...body.size} onClick={handleClick} toDataPoint={mapToDataPoint}>
          {(pt) => {
            if (!pt) {
              return null;
            }
            const screenX = xScale(pt.x);
            const screenY = yScale(pt.y);
            const label = formatPt(pt);
            const textAnchor = screenX < body.size.width / 2 ? 'start' : 'end';
            return (
              <g pointerEvents='none'>
                <circle cx={screenX} cy={screenY} r={3} fill='none' stroke='blue' strokeWidth={3} />
                <text x={screenX} y={tipY} textAnchor={textAnchor} stroke='black' strokeWidth={1}>{label}</text>
              </g>
            );
          }}
        </Mouse>
      </Translate>
      <Translate {...sidebar.pos}>
        <Sidebar {...sidebar.size} lastClicked={clickPt} />
      </Translate>
    </svg>
  )
}
