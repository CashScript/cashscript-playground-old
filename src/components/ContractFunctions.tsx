import React from 'react'
import { Artifact, Contract } from 'cashscript'
import ContractFunction from './ContractFunction';

interface Props {
    artifact?: Artifact,
    contract?: Contract
}

const ContractFunctions: React.FC<Props> = ({ artifact, contract }) => {
  const functions = artifact?.abi.map(func => (
    <ContractFunction contract={contract} abi={func} />
  ))

  return (
    <div style={{
      height: '100%',
      borderRadius: '0px 0px 4px 4px',
      borderTop: '5px solid #eee',
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

export default ContractFunctions;
