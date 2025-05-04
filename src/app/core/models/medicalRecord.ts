export interface MedicalRecord {
    id: string;
    nom: string;
    type: string,
    contenu: string;
    fichier: {
        id: string;
        type: string;
        extension: string;
        fileName: string;
        mimeType: string;
        path: string;
    };
    patientId: string;
    creationDate: Date;
}