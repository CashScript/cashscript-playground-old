import React from 'react'
import { Artifact, Contract } from 'cashscript'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import ContractFunction from './ContractFunction';

interface Props {
    artifact?: Artifact,
    contract?: Contract,
    theme: string
}

const ContractFunctions: React.FC<Props> = ({ artifact, contract, theme }) => {
  const functions = artifact?.abi.map(func => (
    <ContractFunction contract={contract} abi={func} theme={theme} />
  ))

  return (
    <div
      css={theme === 'dark'
      ? css`
      height: 100%;
      border-radius: 0px 0px 4px 4px;
      border-top: 2px solid #171616;
      font-size: 100%;
      line-height: inherit;
      overflow: auto;
      background: #202124;
      padding: 8px 16px;
      color: #cfcfcf;
      `
      : css`
      height: 100%;
      border-radius: 0px 0px 4px 4px;
      border-top: 2px solid #eeeeee;
      font-size: 100%;
      line-height: inherit;
      overflow: auto;
      background: #fffffe;
      padding: 8px 16px;
      color: #000;
    `}
    >
      {contract &&
      <div>
        <h2>Functions</h2>
        {functions}
      </div>
      }
    </div>
  )
}

export default ContractFunctions;
