/* eslint-disable node/no-extraneous-import */
import { DiffDate } from '../models';

export const calcDiffDate = (start: Date, end: Date): DiffDate => {
  const delta = end.getTime() - start.getTime();
  if (delta < 0) return null;
  const days = Math.floor(delta / (24 * 3600 * 1000));
  const hours = Math.floor(delta / (3600 * 1000));
  const minutes = Math.floor(delta / (60 * 1000));
  return new DiffDate({ days, hours, minutes })
}
