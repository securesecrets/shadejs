import { StdSignature } from 'secretjs';

type AccountPermit = {
  params: {
    data?: string,
    contract?: string,
    key: string,
  },
  chain_id : string,
  signature : StdSignature,
}

export type {
  AccountPermit,
};
