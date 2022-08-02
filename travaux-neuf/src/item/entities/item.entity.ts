import { IsNumber, isNumber } from "class-validator";
import { Description } from "src/description/entities/description.entity";
import { Itemsave } from "src/itemsave/entities/itemsave.entity";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Sousitem } from "src/sousitem/entities/sousitem.entity";
import { Typeobjet } from "src/typeobjet/entities/typeobjet.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

/**
 * Fichier de configuration de la table item au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */

@Entity('item')
export class Item {
    
   
    @PrimaryColumn({length : 10})
    idItem : string;

    @Column({length : 50})
    libelleItem : string

    @ManyToOne(() => Objetrepere)
    @JoinColumn({name: 'idOR'})
    @Column({length : 6})
    idOR : string

    @Column({length : 4})
    numeroUnique : string;

    @Column({width : 1})
    digit : number;

    @ManyToOne(() => Typeobjet)
    @JoinColumn({name: 'codeObjet'})
    @Column({length : 2})
    codeObjet : string;

    @Column()
    securite : boolean;

    @Column({nullable:false})
    etat : string;

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50, nullable:true})
    posteCreation : string;

    @Column({type : "timestamp"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

    @Column({type : "timestamp", nullable:true})
    dateModification : Date;

    @ManyToMany(() => Description)
    @JoinTable({name : "descriptionParItem"})
    description : Description[];


    
}
