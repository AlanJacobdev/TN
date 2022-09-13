import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * Fichier de configuration de la table paramètre au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */

@Entity('parametre')
export class Parametre {

    @PrimaryColumn()
    libelle : string;

    @Column()
    valeur : string;

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50, nullable:true})
    posteCreation : string;

    @Column({type : "timestamp"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

    @Column({type : "timestamp", nullable:true})
    dateModification : Date;
}
