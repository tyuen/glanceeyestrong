import type { InitResponse } from '../../shared/api';
import { isInitResponseCandidate } from './isInitResponseCandidate';
import { isNumberArray } from './isNumberArray';

export function isInitResponse(value: unknown): value is InitResponse {
  return (
    isInitResponseCandidate(value) &&
    value.type === 'init' &&
    isNumberArray(value.scores)
  );
}
