import React, { useState, useEffect } from 'react'
import { Artifact, Contract } from 'cashscript'
import { ColumnFlex } from './shared'
import ContractCreation from './ContractCreation'
import ContractFunctions from './ContractFunctions'

interface Props {
  artifact?: Artifact
}

const ContractInfo: React.FC<Props> = ({ artifact }) => {
  const [contract, setContract] = useState<Contract | undefined>(undefined);

  useEffect(() => setContract(undefined), [artifact]);

  return (
    <ColumnFlex
      id="preview"
      style={{ flex: 1, padding: '16px' }}
    >
      <ContractCreation artifact={artifact} contract={contract} setContract={setContract} />
      <ContractFunctions artifact={artifact} contract={contract} />
    </ColumnFlex>
  )
}

export default ContractInfo;
