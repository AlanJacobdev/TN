import { Atelier } from "src/atelier/entities/atelier.entity";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('numerounique')
export class Numerounique {
    
    @OneToMany (() => Objetrepere, (Or : Objetrepere) => Or.numeroUnique)
    @PrimaryColumn({length : 4})
    idNumeroUnique : string;
    
    @Column({length : 1, type: "string"})
    @ManyToOne(() => Atelier)
    @JoinColumn({name: 'idAtelier'})
    idAtelier : Atelier;
    
    @Column({type : "int", width : 3})
    numeroObjet : number
}
