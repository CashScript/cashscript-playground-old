import React, { useState } from 'react'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { RowFlex } from './shared'
import Editor from './Editor';
import ContractInfo from './ContractInfo';
import { Artifact, CashCompiler } from 'cashscript';

interface Props {
  theme: string
}

const Main: React.FC<Props> = ({ theme }) => {
  const [code, setCode] = useState<string>(
`pragma cashscript ^0.5.0;

contract TransferWithTimeout(pubkey sender, pubkey recipient, int timeout) {
    // Require recipient's signature to match
    function transfer(sig recipientSig) {
        require(checkSig(recipientSig, recipient));
    }

    // Require timeout time to be reached and sender's signature to match
    function timeout(sig senderSig) {
        require(checkSig(senderSig, sender));
        require(tx.time >= timeout);
    }
}
`);

  const [artifact, setArtifact] = useState<Artifact | undefined>(undefined);

  function compile() {
    try {
      const artifact = CashCompiler.compileString(code);
      setArtifact(artifact);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <RowFlex
      css={css`
        padding: 32px;
        padding-top: 0px;
        height: calc(100vh - 170px);
    `}>
      <Editor theme={theme} code={code} setCode={setCode} compile={compile} />
      <ContractInfo theme={theme} artifact={artifact} />
    </RowFlex>
  )
}

export default Main;
