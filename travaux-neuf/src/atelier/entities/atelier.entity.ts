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

    @Column({length : 50})
    posteCreation : string;

    @Column({type : "datetime"})
    dateCreation : Date;

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;

    @Column({type : "datetime"})
    dateModification : Date;

}
