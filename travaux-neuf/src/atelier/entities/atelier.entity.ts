import { Numerounique } from "src/numerounique/entities/numerounique.entity";
import { Column, Entity, OneToMany, PrimaryColumn, Timestamp } from "typeorm";

@Entity('atelier')
export class Atelier {

    
    @PrimaryColumn({length : 1})
    idAtelier : string;

    @Column({length : 50})
    libelleAtelier : string;

    @Column({length : 10 })
    codeGMAO : string;

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50, nullable:true})
    posteCreation : string;

    @Column({type : "datetime"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

    @Column({type : "datetime", nullable:true})
    dateModification : Date;

}
