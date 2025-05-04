export interface Imagerie {
    id: string;
    titre: string;
    description: string;
    folderId: string;
    type: 'FICHIER';
    fichier: {
        id: string;
        type: string;
        extension: string;
        fileName: string;
        mimeType: string;
        path: string;
    };
    createdBy: string;
    creationDate: string | Date;
    lastModifiedBy: string;
    lastModifiedDate: string | Date;
}