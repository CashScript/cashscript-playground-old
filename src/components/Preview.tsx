import React from 'react'
import { Artifact } from 'cashscript'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { ColumnFlex } from './shared'

interface Props {
    artifact?: Artifact,
    theme: string
}

const Preview: React.FC<Props> = ({ artifact, theme }) => {
  return (
    <ColumnFlex
      id="preview"
      css={css`
      flex: 1;
      padding: 16px;
      `}
    >
      <div
        css={theme === 'dark'
        ? css`
        height: 100%;
        border-radius: 4px;
        border: none;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 1);
        font-size: 100%;
        line-height: inherit;
        overflow: auto;
        background: #202124;
        padding: 8px 16px;
        color: #cfcfcf;
        `
        : css`
        height: 100%;
        border-radius: 4px;
        border: none;
        box-shadow: 2px 2px 10px #999;
        font-size: 100%;
        line-height: inherit;
        overflow: auto;
        background: #fffffe;
        padding: 8px 16px;
        color: #000;
      `}
      >
        {JSON.stringify(artifact, null, 2)}
      </div>
    </ColumnFlex>
  )
}

export default Preview;
