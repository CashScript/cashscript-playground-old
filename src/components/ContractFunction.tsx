import React, { useState, useEffect } from 'react'
import { Contract, AbiFunction, Argument } from 'cashscript'
import { Recipient } from 'cashscript/dist/interfaces';
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import { readAsType } from './shared';

interface Props {
  contract?: Contract,
  abi?: AbiFunction
}

const ContractFunction: React.FC<Props> = ({ contract, abi }) => {
  const [args, setArgs] = useState<Argument[]>([]);
  const [outputs, setOutputs] = useState<Recipient[]>([]);

  useEffect(() => {
    // Set empty strings as default values
    const newArgs = abi?.inputs.map(() => '') || [];
    setArgs(newArgs);
  }, [abi])

  const inputFields = abi?.inputs.map((input, i) => (
    <Form.Control size="sm" id={`${input.name}-parameter-${i}`}
      placeholder={`${input.type} ${input.name}`}
      aria-label={`${input.type} ${input.name}`}
      onChange={(event) => {
        const argsCopy = [...args];
        argsCopy[i] = readAsType(event.target.value, input.type);
        setArgs(argsCopy);
      }}
    />
  )) || [];

  const receiverInputGroup = (
    <InputGroup>
      <Form.Control type="text" size="sm"
        placeholder="Receiver address"
        aria-label="Receiver address"
        onChange={(event) => {
          const outputsCopy = [...outputs];
          const output = outputsCopy[0] || { to: '', amount: 0 }
          output.to = event.target.value;
          outputsCopy[0] = output;
          setOutputs(outputsCopy);
        }}
      />
      <Form.Control type="text" size="sm"
        placeholder="Send amount"
        aria-label="Send amount"
        onChange={(event) => {
          const outputsCopy = [...outputs];
          const output = outputsCopy[0] || { to: '', amount: 0 }
          output.amount = Number(event.target.value);
          outputsCopy[0] = output;
          setOutputs(outputsCopy);
        }}
      />
    </InputGroup>
  )

  async function sendTransaction() {
    if (!contract || !abi) return;
    try {
      const { txid } = await contract.functions[abi.name](...args)
        .to(outputs)
        .send();

      alert(`Transaction successfully sent: https://explorer.bitcoin.com/bch/tx/${txid}`)
    } catch (e) {
      alert(e.message)
    }
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
            <Card.Subtitle style={{ marginTop: '10px' }}>Transaction details</Card.Subtitle>
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

export default ContractFunction;
