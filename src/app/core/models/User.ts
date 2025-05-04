export interface User {
    id:string;
    firstName: string;
    password:string;
    lastName: string;
    email : string;
    birthDate: Date;
    phoneNumber: string;
    imageUrl?: string;
    gender:string;
    address:string;
    idCard:string;
    cabinetId:string;
    dateModification:Date;
    lastModifiedBy:string;
    creationDate:Date;
    createdBy:string;
    showMenu:boolean;  
}
