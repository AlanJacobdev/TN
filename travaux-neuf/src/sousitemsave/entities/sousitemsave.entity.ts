import { Description } from "src/description/entities/description.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm"

@Entity('sousitemsauvegarde')
export class Sousitemsave {

   
    @PrimaryColumn({length : 20})
    idSousItem : string;
    
    @Column({length : 250})
    libelleSousItem: string;
    
    @Column({length : 12})
    idItem: string;
    
    @Column({length : 2})
    codeSousItem: string;
    
    @Column()
    securite : boolean;
    
    @Column()
    estPrefixe: boolean;
    
    @Column()
    etat: string;
    
    @PrimaryColumn({type : "timestamp"})
    date : Date

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

    @ManyToMany(() => Description)
    @JoinTable({name : "descriptionParSousItemSave"})
    description : Description[];

    @Column({length : 50})
    status: string;

}
