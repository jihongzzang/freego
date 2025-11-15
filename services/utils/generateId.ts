import { getTsid } from 'tsid-ts';

export function generateId(): string {
  return getTsid().toString();
}
