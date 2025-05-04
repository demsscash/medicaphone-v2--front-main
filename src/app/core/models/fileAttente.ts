export interface FileAttente {
  id?: string;
  nom: string;
  prenom: string;
  telephone: string;
  subject: string;
  status: string;
  cabinetId?: string;
  showStatusMenu?: boolean;
  imageId?: string;
}