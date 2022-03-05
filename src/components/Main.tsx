import React, { useState, useEffect } from 'react';
import { Artifact, Network } from 'cashscript';
import { compileString } from 'cashc';
import { RowFlex, Wallet } from './shared';
import Editor from './Editor';
import ContractInfo from './ContractInfo';
import WalletInfo from './Wallets';

interface Props {}

const Main: React.FC<Props> = () => {
  const [code, setCode] = useState<string>(
`pragma cashscript ^0.6.5;

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
  const [network, setNetwork] = useState<Network>('mainnet')
  const [showWallets, setShowWallets] = useState<boolean | undefined>(false);
  const [wallets, setWallets] = useState<Wallet[]>([])

  useEffect(() => {
    compile();
  }, [])

  function compile() {
    try {
      const artifact = compileString(code);
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
      <WalletInfo style={!showWallets?{display:'none'}:{}} network={network} setShowWallets={setShowWallets} wallets={wallets} setWallets={setWallets}/>
      <ContractInfo style={showWallets?{display:'none'}:{}} artifact={artifact} network={network} setNetwork={setNetwork} setShowWallets={setShowWallets} wallets={wallets}/>
    </RowFlex>
  )
}

export default Main;
