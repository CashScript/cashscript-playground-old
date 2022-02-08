import React, { useState, useEffect } from 'react'
import { Contract, AbiFunction, Argument, Network, Recipient } from 'cashscript'
import { Form, InputGroup, Button, Card, Dropdown } from 'react-bootstrap'
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
    console.log(wallets)
  }, [abi])

  const inputFields = abi?.inputs.map((input, i) => (
    <InputGroup>
    <Form.Control size="sm" id={`${input.name}-parameter-${i}`}
      placeholder={`${input.type} ${input.name}`}
      aria-label={`${input.type} ${input.name}`}
      onChange={(event) => {
        const argsCopy = [...args];
        argsCopy[i] = readAsType(event.target.value, input.type);
        setArgs(argsCopy);
      }}
    />
    {input.type==='sig'? (
      <Dropdown>
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" size="sm">
        Select Wallet
      </Dropdown.Toggle>
    
      <Dropdown.Menu>
        {wallets.map((wallet) => (
          <Dropdown.Item href="#/action-1">{wallet.walletName}</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
    ):null}
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
            <Card.Subtitle>Arguments</Card.Subtitle>
            <Card.Text>
              {inputFields}
            </Card.Text>
            <Card.Subtitle style={{ marginTop: '10px',marginBottom: '5px' }}>Transaction outputs <Button variant="outline-secondary" size="sm" onClick={removeOutput}>-</Button> {outputs.length} <Button variant="outline-secondary" size="sm" onClick={addOutput}>+</Button>
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
