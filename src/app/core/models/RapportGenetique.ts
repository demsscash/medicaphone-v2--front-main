import { RapportGenetiqueHist } from './RapportGenetiqueHist';
export interface RapportGenetique {
  id: string;
  commentaire: string;
  groupeSanguin: string;
  allergie: boolean;
  cardiovasculaire: boolean;
  allaitement: boolean;
  antecedentChirurgical: boolean;
  rapportGenetiqueHists: RapportGenetiqueHist[];
  createdBy: string;
  creationDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}