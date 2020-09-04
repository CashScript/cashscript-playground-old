import React, { useState } from 'react'

// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { RowFlex } from './shared'
import Editor from './Editor';
import Preview from './Preview';

interface Props {
  theme: string
}

const Main: React.FC<Props> =  ({ theme }) => {
  const [markdownContent, setMarkdownContent] = useState<string>(
`pragma cashscript ^0.5.0;

contract TransferWithTimeout(pubkey sender, pubkey recipient, int timeout) {
    // Require recipient's signature to match
    function transfer(sig recipientSig) {
        require(checkSig(recipientSig, recipient));
    }

    // Require timeout time to be reached and sender's signature to match
    function timeout(sig senderSig) {
        require(checkSig(senderSig, sender));
        require(tx.time >= timeout);
    }
}
`);
  return (
    <RowFlex
      css={css`
        padding: 32px;
        padding-top: 0px;
        height: calc(100vh - 170px);
        `}>
      <Editor theme={theme} markdownContent={markdownContent} setMarkdownContent={setMarkdownContent}/>
      <Preview theme={theme} markdownContent={markdownContent}/>
    </RowFlex>
  )
}

export default Main;
