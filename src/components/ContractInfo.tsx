import React, { useState, useEffect } from 'react'
import { Artifact, Contract } from 'cashscript'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { ColumnFlex } from './shared'
import ContractCreation from './ContractCreation'
import ContractFunctions from './ContractFunctions'

interface Props {
    artifact?: Artifact,
    theme: string
}

const ContractInfo: React.FC<Props> = ({ artifact, theme }) => {
  const [contract, setContract] = useState<Contract | undefined>(undefined);

  useEffect(() => setContract(undefined), [artifact]);

  return (
    <ColumnFlex
      id="preview"
      css={css`
      flex: 1;
      padding: 16px;
      `}
    >
      <ContractCreation artifact={artifact} contract={contract} setContract={setContract} theme={theme} />
      <ContractFunctions artifact={artifact} contract={contract} theme={theme} />
    </ColumnFlex>
  )
}

export default ContractInfo;
