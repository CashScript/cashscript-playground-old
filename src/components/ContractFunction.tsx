import React, { useState } from 'react'
import { Contract, AbiFunction, Argument } from 'cashscript'
import { Recipient } from 'cashscript/dist/interfaces';

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Form, InputGroup, Button, Card } from 'react-bootstrap';
import { readAsType } from './shared';

interface Props {
  contract?: Contract,
  abi?: AbiFunction,
  theme: string
}

const ContractFunction: React.FC<Props> = ({ contract, abi, theme }) => {
  const [args, setArgs] = useState<Argument[]>([]);
  const [outputs, setOutputs] = useState<Recipient[]>([]);

  const inputFields = abi?.inputs.map((input, i) => (
    <Form.Control type="text" size="sm"
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
        <Card>
          <Card.Header>{abi?.name}</Card.Header>
          <Card.Body>
            <Card.Subtitle>Arguments</Card.Subtitle>
            <Card.Text>
              {inputFields}
            </Card.Text>
            <Card.Subtitle>Transaction details</Card.Subtitle>
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
