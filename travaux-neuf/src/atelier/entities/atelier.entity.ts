import { Numerounique } from "src/numerounique/entities/numerounique.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('atelier')
export class Atelier {

    @OneToMany (() => Numerounique, (NU : Numerounique) => NU.idAtelier)
    @PrimaryColumn({length : 1})
    idAtelier : string;

    @Column({length : 50})
    libelleAtelier : string;

    @Column({length : 10 })
    codeGMAO : string;

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50})
    posteCréation : string;

    @Column({type : "datetime"})
    dateCreation : Date;

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;

    @Column({type : "datetime"})
    dateModification : Date;

}
