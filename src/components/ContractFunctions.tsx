import React from 'react'
import { Artifact, Contract } from 'cashscript'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { Form, InputGroup, Button } from 'react-bootstrap';

interface Props {
    artifact?: Artifact,
    contract?: Contract,
    theme: string
}

const ContractFunctions: React.FC<Props> = ({ artifact, contract, theme }) => {
  const functionForms = artifact?.abi.map(func => {
    const functionArgs: string[] = [];
    const inputFields = func.inputs.map((input, i) => {
      return <Form.Control type="text" size="sm"
        placeholder={`${input.type} ${input.name}`}
        aria-label={`${input.type} ${input.name}`}
        onChange={(event) => {
          functionArgs[i] = event.target.value;
        }}
      />
    });

    const functionButton = <Button variant="secondary" size="sm">{func.name}</Button>

    const functionForm = inputFields.length > 0
    ? (<InputGroup size="sm">
        {inputFields}
        <InputGroup.Append>
          {functionButton}
        </InputGroup.Append>
      </InputGroup>)
    : contract && functionButton;

    return functionForm;
  }) || [];

  return (
    <div
      css={theme === 'dark'
      ? css`
      height: 100%;
      border-radius: 0px 0px 4px 4px;
      border-top: 2px solid black;
      font-size: 100%;
      line-height: inherit;
      overflow: auto;
      background: #202124;
      padding: 8px 16px;
      color: #cfcfcf;
      `
      : css`
      height: 100%;
      border-radius: 0px 0px 4px 4px;
      border-top: 2px solid black;
      font-size: 100%;
      line-height: inherit;
      overflow: auto;
      background: #fffffe;
      padding: 8px 16px;
      color: #000;
    `}
    >
      {contract &&
      <div>
        <h2>Functions</h2>
        {functionForms}
      </div>
      }
    </div>
  )
}

export default ContractFunctions;
