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

    @Column({type : "timestamp"})
    dateCreation : Date;


}
