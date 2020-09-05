import React, { useState } from 'react'
import { Contract, AbiFunction, Argument } from 'cashscript'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Form, InputGroup, Button } from 'react-bootstrap';
import { readAsType } from './shared';

interface Props {
  contract?: Contract,
  abi?: AbiFunction,
  theme: string
}

const ContractFunction: React.FC<Props> = ({ contract, abi, theme }) => {
  const [args, setArgs] = useState<Argument[]>([]);

    const inputFields = abi?.inputs.map((input, i) => {
      return <Form.Control type="text" size="sm"
        placeholder={`${input.type} ${input.name}`}
        aria-label={`${input.type} ${input.name}`}
        onChange={(event) => {
          const argsCopy = [...args];
          argsCopy[i] = readAsType(event.target.value, input.type);
          setArgs(argsCopy);
        }}
      />
    }) || [];

    const functionButton = <Button variant="secondary" size="sm">{abi?.name}</Button>

    const functionForm = inputFields.length > 0
    ? (<InputGroup size="sm">
        {inputFields}
        <InputGroup.Append>
          {functionButton}
        </InputGroup.Append>
      </InputGroup>)
    : contract && functionButton;

  return (
    <div>
      {contract && functionForm}
    </div>
  )
}

export default ContractFunction;
