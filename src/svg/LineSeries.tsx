import React from "react";

import { line } from "d3-shape";

import styles from "./style.module.css";
import { ScaleTime, ScaleLinear } from "d3-scale";
import { Datum } from "../util";

const LineSeries: React.FC<{
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  data: Datum[];
}> = ({ xScale, yScale, data }) => {
  const linePath = line<Datum>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))(data) as string;
  return <path className={styles.line} d={linePath} />;
};

export default LineSeries;
