import React, { useState } from 'react'
import { Artifact } from 'cashscript';
import { CashCompiler } from 'cashsc';
import { RowFlex } from './shared'
import Editor from './Editor';
import ContractInfo from './ContractInfo';

interface Props {}

const Main: React.FC<Props> = () => {
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
      console.error(e.message);
    }
  }

  return (
    <RowFlex style={{
      padding: '32px',
      paddingTop: '0px',
      height: 'calc(100vh - 120px'
    }}>
      <Editor code={code} setCode={setCode} compile={compile} />
      <ContractInfo artifact={artifact} />
    </RowFlex>
  )
}

export default Main;
