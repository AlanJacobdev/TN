import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('typeobjetrepere')
export class Typeobjetrepere {

    @OneToMany (() => Objetrepere, (or : Objetrepere) => or.codeType)
    @PrimaryColumn({length : 2})
    idTypeOR : string;

    @Column({length : 200})
    libelleTypeOR : string;

}
