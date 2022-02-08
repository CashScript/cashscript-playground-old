import React from 'react'
import { ColumnFlex } from './shared'
import { Button, Card } from 'react-bootstrap'
import { 
  binToHex,
  hexToBin,
  instantiateSecp256k1,
  generatePrivateKey, 
  instantiateRipemd160, 
  instantiateSha256,
  Base58AddressFormatVersion,
  encodeCashAddress,
  CashAddressType
} from '@bitauth/libauth'

interface Wallet {
  privKeyHex: string
  pubKeyHex: string
  pubKeyHashHex: string
  address: string
}

interface Props {
  setShowWallets:(showWallets: boolean) => void
  wallets: Wallet[]
  setWallets:(wallets: Wallet[]) => void
  style: any
}

interface Wallet {
  privKeyHex: string
  pubKeyHex: string
  pubKeyHashHex: string
  address: string
}

const Test: React.FC<Props> = ({setShowWallets,  wallets, setWallets, style}) => {
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

    const address = hash160ToCash(pubKeyHashHex)

    walletsCopy.push({privKeyHex,pubKeyHex,pubKeyHashHex,address})
    setWallets(walletsCopy)
  }

  function hash160ToCash(hex: string, network: number = 0x00) {
    let type: string = Base58AddressFormatVersion[network] || "p2pkh";
    let prefix = "bitcoincash";
    if (type.endsWith("Testnet")) prefix = "bchtest"
    let cashType: CashAddressType = 0;
    return encodeCashAddress(prefix, cashType, hexToBin(hex));
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
          <strong>Address: </strong>
          <p>{wallet.address}</p>
        </Card.Text>
      </Card.Body>
    </Card>
  ))

  return (
    <ColumnFlex
      id="preview"
      style={{ ...style, flex: 1, margin: '16px' }}
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
