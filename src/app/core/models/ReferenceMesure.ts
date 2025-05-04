import { HealthIndicator } from "./HealthIndicator";
import { TypeDeVariatiion } from "./TypeDeVariatiion";

export interface ReferenceMesure {
    id?: string; 
    label: HealthIndicator;
    variation: TypeDeVariatiion;
    type: string;
    description: string;
    uniteMesure: string;
    valeurMin: number;
    valeurMax: number;
    deleted?: boolean;
    createdBy: string;
    creationDate: string;
    lastModifiedBy: string;
    lastModifiedDate: string; 
}