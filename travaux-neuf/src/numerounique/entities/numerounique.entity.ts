import { Atelier } from "src/atelier/entities/atelier.entity";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

/**
 * Fichier de configuration de la table numerounique au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */

@Entity('numerounique')
export class Numerounique {

    @PrimaryColumn({length : 4})
    idNumeroUnique : string;
    
    @Column("string", {length : 1, unique:false} )
    @ManyToOne(() => Atelier, {nullable : false})
    @JoinColumn({name: 'idAtelier'})
    idAtelier : Atelier;
    
    @Column({length : 3})
    numeroObjet : string;

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
