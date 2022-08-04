import { Allow, IsNotEmpty } from "class-validator";
import { Atelier } from "src/atelier/entities/atelier.entity";
import { Typeobjetrepere } from "src/typeobjetrepere/entities/typeobjetrepere.entity";

/**
 * Structure de données attendue pour la création d'un role
 * @IsNotEmpty() => Données obligatoire (Erreur si absente)
 * @Allow() => Données facultatives
 * Aucun Decorateur => Données non attendue mais complétées ultérieurement
 */

export class CreateRoleDto {

    @IsNotEmpty()
    libelleRole : string

    @Allow()
    atelier : Atelier[];
    
    @Allow()
    typeObjet : Typeobjetrepere[];

    dateCreation : Date

    @IsNotEmpty()
    profilCreation : string
    
}
