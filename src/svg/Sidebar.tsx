import React from 'react'
import { Datum, Size, formatPt } from '../util';

import styles from './style.module.css';

export const Sidebar: React.FC<Size & { lastClicked: Datum | undefined }> = ({width, height, lastClicked}) => {
  return (
    <foreignObject width={width} height={height}>
      <div className={styles.sidebar}>
        <div>{lastClicked ? 'last click:' : 'no clicks yet'}</div>
        <div>{lastClicked && formatPt(lastClicked)}</div>
      </div>
    </foreignObject>
  )
}