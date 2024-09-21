import {RomajiCandidate} from './romaji-candidate';

export type RomajiChunk = {
  chunk: string;
  candidates: RomajiCandidate[];
};
