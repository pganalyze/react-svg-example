import React, { useState } from "react";

import { scaleLinear, scaleTime } from "d3-scale";
import { extent } from "d3-array";
import { Datum, Pos, Layout } from "../util";
import { Mouse } from "../svg/Mouse";
import { Translate } from "./Translate";
import { LeftAxis, BottomAxis } from "./Axis";
import LineSeries from "./LineSeries";
import Tooltip from "./Tooltip";

export const Chart: React.FC<{
  data: Datum[];
}> = ({ data }) => {
  const viewBoxWidth = 800;
  const viewBoxHeight = 400;
  const paddingX = 6;
  const paddingY = 4;
  const bottomAxisHeight = 30;
  const leftAxisWidth = 50;
  const bodyHeight = viewBoxHeight - bottomAxisHeight - 2 * paddingY;
  const bodyWidth = viewBoxWidth - leftAxisWidth - 2 * paddingX;
  const leftAxis: Layout = {
    pos: {
      x: paddingX,
      y: paddingY,
    },
    size: {
      width: leftAxisWidth,
      height: bodyHeight,
    },
  };
  const bottomAxis: Layout = {
    pos: {
      x: paddingX + leftAxisWidth,
      y: paddingY + bodyHeight,
    },
    size: {
      width: bodyWidth,
      height: bottomAxisHeight,
    },
  };
  const body: Layout = {
    pos: {
      x: leftAxis.pos.x + leftAxisWidth,
      y: paddingY,
    },
    size: {
      width: bodyWidth,
      height: bodyHeight,
    },
  };
  const [clickPt, setClickPt] = useState<Datum | undefined>(undefined);
  const handleClick = (pt: Datum) => {
    setClickPt(pt);
    console.log(clickPt);
  };

  // d3 scales map from your data domain to another domain (in this case, our chart size).
  const xExtent = extent(data, (d) => d.x);
  const yExtent = extent(data, (d) => d.y);
  if (xExtent[0] == null || xExtent[1] == null || yExtent[0] == null || yExtent[1] == null) {
    return <div>insufficient data available</div>;
  }

  const xScale = scaleTime().domain(xExtent).range([0, body.size.width]);
  // N.B.: because the svg co-ordinate system starts at the upper left, but
  // we would like to stick with a standard cartesian coordinate system for our
  // chart, which starts at the bottom left, we invert the range here, mapping
  // y values from height to 0, instead of from 0 to height.
  const yScale = scaleLinear().domain(yExtent).range([body.size.height, 0]);

  const mapToDataPoint = (mouse: Pos) => {
    // For larger datasets, consider d3-bisect https://observablehq.com/@d3/d3-bisect
    const closest = data.reduce(
      (result, datum, idx) => {
        const thisDistance = Math.abs(mouse.x - xScale(datum.x));
        if (thisDistance < result.distance) {
          return {
            distance: thisDistance,
            index: idx,
          };
        } else {
          return result;
        }
      },
      { distance: Infinity, index: -1 },
    );

    return data[closest.index];
  };

  return (
    <svg width="100%" height="400" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      <Translate {...body.pos}>
        <LineSeries data={data} xScale={xScale} yScale={yScale} />
        <Mouse {...body.size} onClick={handleClick} toDataPoint={mapToDataPoint}>
          {(pt) => {
            return <Tooltip point={pt} xScale={xScale} yScale={yScale} {...body.size} />;
          }}
        </Mouse>
      </Translate>
      <Translate {...leftAxis.pos}>
        <LeftAxis scale={yScale} {...leftAxis.size} />
      </Translate>
      <Translate {...bottomAxis.pos}>
        <BottomAxis scale={xScale} {...bottomAxis.size} />
      </Translate>
    </svg>
  );
};
