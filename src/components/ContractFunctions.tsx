import React from 'react'
import { Artifact, Contract, Network } from 'cashscript'
import ContractFunction from './ContractFunction'

interface Props {
  artifact?: Artifact
  contract?: Contract
  network: Network
}

const ContractFunctions: React.FC<Props> = ({ artifact, contract, network }) => {
  const functions = artifact?.abi.map(func => (
    <ContractFunction contract={contract} abi={func} network={network} />
  ))

  return (
    <div style={{
      height: '100%',
      border: '2px solid black',
      borderTop: '1px solid black',
      fontSize: '100%',
      lineHeight: 'inherit',
      overflow: 'auto',
      background: '#fffffe',
      padding: '8px 16px',
      color: '#000'
    }}>
      {contract &&
        <div>
          <h2>Functions</h2>
          {functions}
        </div>
      }
    </div>
  )
}

export default ContractFunctions
