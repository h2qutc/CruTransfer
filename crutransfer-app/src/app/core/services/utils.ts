/* eslint-disable node/no-extraneous-import */
import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { DiffDate } from '../models';
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
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const calcDiffDate = (start: Date, end: Date): DiffDate => {
  const delta = end.getTime() - start.getTime();
  if (delta < 0) return null;
  const days = Math.floor(delta / (24 * 3600 * 1000));
  const hours = Math.floor(delta / (3600 * 1000));
  const minutes = Math.floor(delta / (60 * 1000));
  return new DiffDate({ days, hours, minutes })
}
