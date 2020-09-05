import React, { useState, useRef } from 'react'

import { ControlledEditor } from '@monaco-editor/react';

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { ColumnFlex } from './shared'

import { Button } from 'react-bootstrap';

interface Props {
  code: string;
  setCode: (value: string) => void,
  compile: () => void,
  theme: string
}

const Editor: React.FC<Props> = ({ code, setCode, compile, theme }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const valueGetter = useRef<() => string>();

  function handleEditorDidMount(getter: () => string) {
    setIsEditorReady(true);
    valueGetter.current = getter;
  }
  return (
    <ColumnFlex
      id="editor"
      css={css`
        flex: 1;
        padding: 16px;
    `}>
      <ControlledEditor
        height="90vh"
        language="sol"
        value={code}
        theme={theme}
        onChange={(ev: any, code?: string) => code && setCode(code)}
        editorDidMount={handleEditorDidMount}
      />
      <Button
        variant="secondary" disabled={!isEditorReady}
        onClick={() => compile()}
      >Compile</Button>
    </ColumnFlex>
  )
}

export default Editor;
