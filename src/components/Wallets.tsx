import React from 'react'
import { ColumnFlex } from './shared'
import { Button, Card } from 'react-bootstrap'
import { 
  binToHex, 
  instantiateSecp256k1,
  generatePrivateKey, 
  instantiateRipemd160, 
  instantiateSha256 
} from '@bitauth/libauth'

interface Wallet {
  privKeyHex: string
  pubKeyHex: string
  pubKeyHashHex: string
}

interface Props {
  setShowWallets:(showWallets: boolean) => void
  wallets: Wallet[]
  setWallets:(wallets: Wallet[]) => void
}

const Test: React.FC<Props> = ({setShowWallets, wallets, setWallets}) => {
  async function addWallet() {
    const walletsCopy = [...wallets]

    const secp256k1 = await instantiateSecp256k1();
    const ripemd160 = await instantiateRipemd160();
    const sha256 = await instantiateSha256();

    const privKey = generatePrivateKey(() =>
    window.crypto.getRandomValues(new Uint8Array(32))
    )
    const privKeyHex = binToHex(privKey)

    const pubKey = secp256k1.derivePublicKeyCompressed(privKey)
    const pubKeyHex = binToHex(pubKey)

    const pubKeyHash = ripemd160.hash(sha256.hash(pubKey))
    const pubKeyHashHex = binToHex(pubKeyHash)

    walletsCopy.push({privKeyHex,pubKeyHex,pubKeyHashHex})
    setWallets(walletsCopy)
  }

  function removeWallet(index:number) {
    const walletsCopy = [...wallets]
    walletsCopy.splice(index, 1)
    setWallets(walletsCopy)
  }

  const walletList = wallets.map((wallet, index) => (
    <Card style={{ marginBottom: '10px' }} key={wallet.privKeyHex}>
      <Card.Header>{`Wallet${index+1}`}
        <Button style={{float:"right"}} onClick={() => removeWallet(index)} variant="outline-secondary" size="sm">-</Button>
      </Card.Header>
      <Card.Body>
        <Card.Text style={{overflowWrap:'anywhere'}}>
          <strong>Pubkey hex: </strong>
          <p>{wallet.pubKeyHex}</p>
          <strong>Pubkeyhash hex: </strong>
          <p>{wallet.pubKeyHashHex}</p>
        </Card.Text>
      </Card.Body>
    </Card>
  ))

  return (
    <ColumnFlex
      id="preview"
      style={{ flex: 1, margin: '16px' }}
    >
      <div style={{
        height: '100%',
        border: '2px solid black',
        borderBottom: '1px solid black',
        fontSize: '100%',
        lineHeight: 'inherit',
        overflow: 'auto',
        background: '#fffffe',
        padding: '8px 16px',
        color: '#000'
      }}>
        <h2>Wallets <Button onClick={addWallet} variant="outline-secondary" size="sm">+</Button>
          <button onClick={() => setShowWallets(false)} style={{float:'right', border:'none', backgroundColor: 'transparent',outline: 'none'}}>⇆</button>
        </h2>
        {walletList}
      </div>
    </ColumnFlex>
    
  )
}

export default Test
