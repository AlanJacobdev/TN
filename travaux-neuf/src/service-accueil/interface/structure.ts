import { Description } from "src/description/entities/description.entity";

export interface infoPerMonth {
    date : string;
    count : number
}

export interface typeInfoPerMounth {
    objectCreated : infoPerMonth[],
    objectModified : infoPerMonth[],
    objectDeleted : infoPerMonth[]
}

export interface typeInfoPerDay {
    objectCreated : infoPerDay[],
    objectModified : infoPerDay[],
    objectDeleted : infoPerDay[]
}

export interface infoPerDay {
    id : string,
    libelle: string,
    etat: string,
    profilCreation : string
    dateCreation : Date,
    description: Description[],
    typeObjet : string
}
