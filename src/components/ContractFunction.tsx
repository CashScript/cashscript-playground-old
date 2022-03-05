import React, { useState, useEffect } from 'react'
import { Contract, AbiFunction, Argument, Network, Recipient, SignatureTemplate } from 'cashscript'
import { Form, InputGroup, Button, Card } from 'react-bootstrap'
import { readAsType, ExplorerString, Wallet } from './shared'

interface Props {
  contract?: Contract
  abi?: AbiFunction
  network: Network
  wallets: Wallet[]
}

const ContractFunction: React.FC<Props> = ({ contract, abi, network, wallets }) => {
  const [args, setArgs] = useState<Argument[]>([])
  const [outputs, setOutputs] = useState<Recipient[]>([{ to: '', amount: 0 }])

  useEffect(() => {
    // Set empty strings as default values
    const newArgs = abi?.inputs.map(() => '') || [];
    setArgs(newArgs);
  }, [abi])

  function fillPrivKey(i:number,walletIndex:string) {
    const argsCopy = [...args];
    // if no wallet is selected in select form
    if(isNaN(Number(walletIndex))) argsCopy[i] = ''
    else{
      argsCopy[i] = new SignatureTemplate(wallets[Number(walletIndex)].privKey);
    }
    setArgs(argsCopy);
  }

  const inputFields = abi?.inputs.map((input, i) => (
    <InputGroup>
      {input.type==='sig'? (
      <><Form.Control size="sm" id={`${input.name}-parameter-${i}`} disabled
        placeholder={`${input.type} ${input.name}`}
        aria-label={`${input.type} ${input.name}`}
      />
      <Form.Control as="select" size="sm" onChange={event =>fillPrivKey(i,event.target.value)}>
        <option className="text-center" value={`NaN`}>select wallet</option>
        {wallets.map((wallet, walletIndex) => (
            <option className="text-center" value={`${walletIndex}`}>{wallet.walletName}</option>
          ))}
      </Form.Control></>
      ):(
        <Form.Control size="sm" id={`${input.name}-parameter-${i}`}
          placeholder={`${input.type} ${input.name}`}
          aria-label={`${input.type} ${input.name}`}
          onChange={(event) => {
            const argsCopy = [...args];
            argsCopy[i] = readAsType(event.target.value, input.type);
            setArgs(argsCopy);
          }}
        />
      )}
    </InputGroup>
  )) || []

  const receiverInputGroup = outputs.map((output,index) =>(
    <InputGroup>
      <Form.Control size="sm"
        placeholder="Receiver address"
        aria-label="Receiver address"
        onChange={(event) => {
          const outputsCopy = [...outputs]
          const output = outputsCopy[index]
          output.to = event.target.value
          outputsCopy[index] = output
          setOutputs(outputsCopy)
        }}
      />
      <Form.Control size="sm"
        placeholder="Send amount"
        aria-label="Send amount"
        onChange={(event) => {
          const outputsCopy = [...outputs]
          const output = outputsCopy[index]
          output.amount = Number(event.target.value)
          outputsCopy[index] = output
          setOutputs(outputsCopy)
        }}
      />
    </InputGroup>
  ))

  async function sendTransaction() {
    if (!contract || !abi) return
    try {
      const { txid } = await contract.functions[abi.name](...args)
        .to(outputs)
        .send()

      alert(`Transaction successfully sent: ${ExplorerString[network]}/tx/${txid}`)
      console.log(`Transaction successfully sent: ${ExplorerString[network]}/tx/${txid}`)
    } catch (e) {
      alert(e.message)
      console.error(e.message)
    }
  }

  function addOutput() {
    const outputsCopy = [...outputs]
    outputsCopy.push({ to: '', amount: 0 })
    setOutputs(outputsCopy)
  }

  function removeOutput() {
    const outputsCopy = [...outputs]
    outputsCopy.splice(-1)
    setOutputs(outputsCopy)
  }

  return (
    <div>
      {contract &&
        <Card style={{ marginBottom: '10px' }}>
          <Card.Header>{abi?.name}</Card.Header>
          <Card.Body>
            <Card.Subtitle  style={{ marginBottom: '5px' }}>Arguments</Card.Subtitle>
            <Card.Text>
              {inputFields}
            </Card.Text>
            <Card.Subtitle style={{ marginTop: '10px',marginBottom: '5px' }}>
              Transaction outputs{' '}
              <Button variant="outline-secondary" size="sm" disabled={outputs.length<=1} onClick={removeOutput}>-</Button>
              {' '+outputs.length+' '} 
              <Button variant="outline-secondary" size="sm" onClick={addOutput}>+</Button>
            </Card.Subtitle>
            <Card.Text>
              {receiverInputGroup}
            </Card.Text>
            <Button variant="secondary" size="sm" onClick={sendTransaction}>Send</Button>
          </Card.Body>
        </Card>
      }
    </div>
  )
}

export default ContractFunction
