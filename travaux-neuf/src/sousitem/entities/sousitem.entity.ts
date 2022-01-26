import { Item } from "src/item/entities/item.entity";
import { Sousitemsave } from "src/sousitemsave/entities/sousitemsave.entity";
import { Typeobjet } from "src/typeobjet/entities/typeobjet.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity('sousitem')
export class Sousitem {


    @OneToMany (() => Sousitemsave, (sousitemsave : Sousitemsave) => sousitemsave.idSousItem)
    @PrimaryColumn({length : 20})
    idSousItem : string;

    @Column({length : 50})
    libelleSousItem : string;

    @ManyToOne(() => Item)
    @JoinColumn({name: 'idItem'})
    @Column({length : 12})
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

    @Column({length : 50})
    description : string;

}
