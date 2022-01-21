import { Numerounique } from "src/numerounique/entities/numerounique.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('atelier')
export class Atelier {

    @OneToMany (() => Numerounique, (NU : Numerounique) => NU.idAtelier)
    @PrimaryColumn({length : 1})
    idAtelier : string;

    @Column({length : 200})
    libelleAtelier : string;

}
