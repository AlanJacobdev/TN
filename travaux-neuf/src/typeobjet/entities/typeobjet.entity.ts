import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"

/**
 * Fichier de configuration de la table Typeobjet au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */

@Entity('typeobjet')
export class Typeobjet {
    
    @PrimaryColumn({length : 2})
    idType : string;

    @Column({length : 100})
    libelleType : string;
    
    @Column()
    actif : boolean;

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