import { Allow, IsNotEmpty, isNotEmpty } from "class-validator";
import { Itemsave } from "src/itemsave/entities/itemsave.entity";
import { Orsave } from "src/orsave/entities/orsave.entity";
import { Sousitemsave } from "src/sousitemsave/entities/sousitemsave.entity";
import { PrimaryGeneratedColumn } from "typeorm";
import { objetTraitee } from "../interface/interfaceDmdTraitee";

/**
 * Structure de données attendue pour la création d'une demande de suppression traitée
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateDemandeAdminTraiteeDto {

    
    @IsNotEmpty()
    motif : string;

    @IsNotEmpty()
    isDelete : Boolean

    @Allow()
    orDelete : objetTraitee[];
    
    @Allow()
    itemDelete : objetTraitee[];

    @Allow()
    sousItemDelete : objetTraitee[];
    
    @IsNotEmpty()
    profilCreation : string;

    @IsNotEmpty()
    dateCreation : Date;

    @IsNotEmpty()
    profilModification : string;

    @IsNotEmpty()
    dateModification : Date;
}

