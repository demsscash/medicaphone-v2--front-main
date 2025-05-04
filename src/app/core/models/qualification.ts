export interface Qualification {
  id?: string;
  title: string;
  institute: string;
  startDate: string;
  endDate: string;
  userId: string;
  type: 'CERTIFICATE' | 'FORMATION' | 'EXPERIENCE';
}
