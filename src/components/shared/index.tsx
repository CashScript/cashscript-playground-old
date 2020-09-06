import styled from '@emotion/styled'
import { SignatureTemplate } from 'cashscript';

export const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;
`
export const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
`

export function readAsType(value: string, type: string) {
  if (type === 'int') {
    return Number(value);
  } else if (type === 'bool') {
    return value === 'true';
  } else if (type === 'sig') {
    try {
      return new SignatureTemplate(value);
    } catch (e) {
      return value;
    }
  } else {
    return value;
  }
}
