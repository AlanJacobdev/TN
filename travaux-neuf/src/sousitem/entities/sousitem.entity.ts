import { Description } from "src/description/entities/description.entity";
import { Item } from "src/item/entities/item.entity";
import { Typeobjet } from "src/typeobjet/entities/typeobjet.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('sousitem')
export class Sousitem {

    @PrimaryColumn({length : 20})
    idSousItem : string;

    @Column({length : 50})
    libelleSousItem : string;

    @ManyToOne(() => Item)
    @JoinColumn({name: 'idItem'})
    @Column({length : 10})
    idItem : string;

    @ManyToOne(() => Typeobjet)
    @JoinColumn({name: 'codeSousItem'})
    @Column({length : 2})
    codeSousItem : string;

    @Column()
    securite : boolean;

    @Column()
    estPrefixe : boolean;

    @Column({nullable:false})
    etat : string;

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

    @ManyToMany(() => Description)
    @JoinTable({name : "descriptionParSousItem"})
    description : Description[];

}
