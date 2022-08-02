import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Fichier de configuration de la table description au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */

@Entity('description')
export class Description {
    
    @PrimaryGeneratedColumn()
    idDescription : number;

    @Column()
    lien : string;

}
