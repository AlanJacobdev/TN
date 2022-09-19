import { Description } from "src/description/entities/description.entity";

/**
 * Interfaces utiles au sein du service accueil
 */

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
    objectModified : infoPerDayModified[],
    objectDeleted : infoPerDayDelete[]
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

export interface infoPerDayModified {
    id : string,
    libelle: string,
    newlibelle: string,
    etat: string,
    newEtat: string
    profilModification : string
    dateModification : Date,
    description: Description[],
    newDescription : Description[],
    typeObjet : string
}

export interface infoPerDayDelete {
    id : string,
    libelle: string,
    etat: string,
    profilSuppression : string
    dateSuppression : Date,
    description: Description[],
    typeObjet : string
}