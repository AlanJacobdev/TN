import { Description } from "src/description/entities/description.entity";
import { Item } from "src/item/entities/item.entity";
import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity";
import { Sousitem } from "src/sousitem/entities/sousitem.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('demandeAdmin')
export class DemandeAdmin {

    @PrimaryGeneratedColumn()
    idDemande : number;

    @Column()
    motif : string;

    @Column()
    etat : boolean;

    @Column({nullable:true})
    isDelete : boolean

    @ManyToMany(() => Objetrepere)
    @JoinTable({name : "demandeOR"})
    orDelete : Objetrepere[];
    
    @ManyToMany(() => Item)
    @JoinTable({name : "demandeItem"})
    itemDelete : Item[];

    @ManyToMany(() => Sousitem)
    @JoinTable({name : "demandeSousItem"})
    sousItemDelete : Sousitem[];
    
    @Column({length : 50})
    profilCreation : string;

    @Column({type : "datetime"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({type : "datetime", nullable:true})
    dateModification : Date;


}
