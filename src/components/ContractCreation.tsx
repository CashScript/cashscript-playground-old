import React, { useState, useEffect } from 'react'
import { Artifact, Contract, Argument } from 'cashscript'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { InputGroup, Form, Button, Table } from 'react-bootstrap'
import { readAsType } from './shared'

interface Props {
    artifact?: Artifact,
    contract?: Contract,
    setContract: (contract?: Contract) => void,
    theme: string
}

const ContractCreation: React.FC<Props> = ({ artifact, contract, setContract, theme }) => {
  const [args, setArgs] = useState<Argument[]>([]);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    async function updateBalance() {
      if (!contract) return;
      setBalance(await contract.getBalance())
    }
    updateBalance()
  }, [contract]);

  const inputFields = artifact?.constructorInputs.map((input, i) => (
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

  const createButton = <Button variant="secondary" size="sm" onClick={() => createContract()}>Create</Button>

  const constructorForm = inputFields.length > 0
    ? (<InputGroup size="sm">
        {inputFields}
        <InputGroup.Append>
          {createButton}
        </InputGroup.Append>
      </InputGroup>)
    : artifact && createButton;

  function createContract() {
    if (!artifact) return;
    try {
      const newContract = new Contract(artifact, args);
      setContract(newContract);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div
    css={theme === 'dark'
    ? css`
    height: 100%;
    border-radius: 4px 4px 0px 0px;
    border: none;
    font-size: 100%;
    line-height: inherit;
    overflow: auto;
    background: #202124;
    padding: 8px 16px;
    color: #cfcfcf;
    `
    : css`
    height: 100%;
    border-radius: 4px 4px 0px 0px;
    border: none;
    font-size: 100%;
    line-height: inherit;
    overflow: auto;
    background: #fffffe;
    padding: 8px 16px;
    color: #000;
    `}
    >
    <h2>{artifact?.contractName}</h2>
    {constructorForm}
    {contract !== undefined && balance !== undefined &&
      <Table bordered variant={theme}>
        <tbody>
          <tr>
            <td>Contract address</td>
            <td>{contract.address}</td>
          </tr>
          <tr>
            <td>Contract balance</td>
            <td>{balance} satoshis</td>
          </tr>
          <tr>
            <td>Bytecode size</td>
            <td>{contract.bytesize} bytes</td>
          </tr>
          <tr>
            <td>Bytecode opcount</td>
            <td>{contract.opcount} opcodes</td>
          </tr>
        </tbody>
      </Table>
    }
    </div>
  )
}

export default ContractCreation;
