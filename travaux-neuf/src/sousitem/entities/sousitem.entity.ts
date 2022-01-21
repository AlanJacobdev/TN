import { Item } from "src/item/entities/item.entity";
import { Sousitemsave } from "src/sousitemsave/entities/sousitemsave.entity";
import { Typeobjet } from "src/typeobjet/entities/typeobjet.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('sousitem')
export class Sousitem {


    @OneToMany (() => Sousitemsave, (sousitemsave : Sousitemsave) => sousitemsave.idSousItem)
    @PrimaryColumn({length : 10})
    idSousItem : string;

    @Column({length : 200})
    libelleSousItem : string;

    @ManyToOne(() => Item)
    @JoinColumn({name: 'idItem'})
    @Column({length : 12, type: "string"})
    idItem : string;

    @ManyToOne(() => Typeobjet)
    @JoinColumn({name: 'codeSousItem'})
    @Column({length : 2})
    codeSousItem : string;

    @Column()
    securite : boolean;

    @Column()
    estPrefixe : boolean;

    @Column()
    actif : boolean;

    @Column({type : "date"})
    dateCreation : Date;

    @Column({length : 200})
    profilCreation : string;

    @Column({length : 200})
    description : string;

}
