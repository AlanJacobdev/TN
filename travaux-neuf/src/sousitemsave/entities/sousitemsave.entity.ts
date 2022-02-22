import { Sousitem } from "src/sousitem/entities/sousitem.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

@Entity('sousitemsauvegarde')
export class Sousitemsave {

   
    @PrimaryColumn({length : 20})
    idSousItem : string;
    
    @Column({length : 50})
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
    actif: boolean;
    
    @PrimaryColumn({type : "datetime"})
    date : Date

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

    @Column({length : 50, nullable:true})
    description: string;

    @Column({length : 50})
    etat: string;

}
