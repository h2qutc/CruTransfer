/* eslint-disable node/no-extraneous-import */
import {Keyring} from '@polkadot/keyring';
import {KeyringPair} from '@polkadot/keyring/types';
import {SubmittableExtrinsic} from '@polkadot/api/promise/types';
// import logger from './log';


/**
 * Load keyring pair with seeds
 * @param seeds Account's seeds
 */
export function loadKeyringPair(seeds: string): KeyringPair {
  const kr = new Keyring({
    type: 'sr25519',
  });

  const krp = kr.addFromUri(seeds);
  return krp;
}

export async function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}