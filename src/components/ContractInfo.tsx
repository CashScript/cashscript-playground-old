import React, { useState, useEffect } from 'react'
import { Artifact, Contract, Network } from 'cashscript'
import { ColumnFlex } from './shared'
import ContractCreation from './ContractCreation'
import ContractFunctions from './ContractFunctions'

interface Props {
  artifact?: Artifact
}

const ContractInfo: React.FC<Props> = ({ artifact }) => {
  const [contract, setContract] = useState<Contract | undefined>(undefined)
  const [network, setNetwork] = useState<Network>('mainnet')

  useEffect(() => setContract(undefined), [artifact])

  return (
    <ColumnFlex
      id="preview"
      style={{ flex: 1, margin: '16px' }}
    >
      <ContractCreation artifact={artifact} contract={contract} setContract={setContract} network={network} setNetwork={setNetwork} />
      <ContractFunctions artifact={artifact} contract={contract} network={network} />
    </ColumnFlex>
  )
}

export default ContractInfo
