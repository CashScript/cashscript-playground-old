import styled from '@emotion/styled'
import { SignatureTemplate } from 'cashscript';
import { decodeCashAddress, decodeCashAddressFormatWithoutPrefix } from '@bitauth/libauth';

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
  } else if (type === 'bytes20') {
    let addressInfo;

    if (value.startsWith('bitcoincash:') || value.startsWith('bchtest:')) {
      addressInfo = decodeCashAddress(value);
    } else if(value.startsWith('q') || value.startsWith('p')) {
      addressInfo = decodeCashAddressFormatWithoutPrefix(value, ['bitcoincash', 'bchtest']);
    }

    if (addressInfo === undefined || typeof addressInfo === 'string') {
      return value;
    }

    return addressInfo.hash;
  } else {
    return value;
  }
}

export const ExplorerString = {
  mainnet: 'https://explorer.bitcoin.com/bch',
  testnet: 'https://explorer.bitcoin.com/tbch'
}
