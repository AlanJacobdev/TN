import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Typeobjet } from "src/typeobjet/entities/typeobjet.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('item')
export class Item {
    
    @PrimaryColumn({length : 10})
    idItem : string;

    @Column({length : 200})
    libelleItem : string

    @ManyToOne(() => Objetrepere)
    @JoinColumn({name: 'idOR'})
    @Column({length : 6, type : "string"})
    idOR : Objetrepere

    @Column({length : 4})
    numeroUnique : string;

    @Column({width : 1})
    digit : number;

    @ManyToOne(() => Typeobjet)
    @JoinColumn({name: 'codeObjet'})
    @Column({length : 2, type: "string"})
    codeObjet : Typeobjet;

    @Column()
    securite : boolean;

    @Column()
    actif : boolean;

    @Column({type : "date"})
    dateCreation : Date;

    @Column({length : 200})
    profilCreation : string;

    @Column({length : 200})
    description : string;
}
