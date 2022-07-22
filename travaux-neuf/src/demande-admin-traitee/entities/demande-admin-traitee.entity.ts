
import { Itemsave } from "src/itemsave/entities/itemsave.entity";
import { Orsave } from "src/orsave/entities/orsave.entity";
import { Sousitemsave } from "src/sousitemsave/entities/sousitemsave.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('demandeAdminTraitee')
export class DemandeAdminTraitee {

    @PrimaryGeneratedColumn()
    idDemandeTraitee : number;

    @Column()
    motif : string;

    @Column()
    isDelete : boolean

    @ManyToMany(() => Orsave)
    @JoinTable({name : "demandeORTraitee"})
    orDelete : Orsave[];
    
    @ManyToMany(() => Itemsave)
    @JoinTable({name : "demandeItemTraitee"})
    itemDelete : Itemsave[];

    @ManyToMany(() => Sousitemsave)
    @JoinTable({name : "demandeSousItemTraitee"})
    sousItemDelete : Sousitemsave[];
    
    @Column({length : 50})
    profilCreation : string;

    @Column({type : "timestamp"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({type : "timestamp", nullable:true})
    dateModification : Date;
}

