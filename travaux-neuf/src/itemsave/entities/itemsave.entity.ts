import { Item } from "src/item/entities/item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('itemsauvegarde')
export class Itemsave {
    
  
    @PrimaryColumn({length : 10})
    idItem : string;
    
    @Column({length : 50})
    libelleItem : string;
    
    @Column({length : 6})
    idOR : string;
    
    @Column({length : 4})
    numeroUnique : string;
    
    @Column({width : 1})
    digit : number;
    
    @Column({length : 2})
    codeObjet : string;
    
    @Column()
    securite : boolean;
    
    @Column()
    actif : boolean
    
    @PrimaryColumn({type : "datetime"})
    date : Date

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;
    
    @Column({length : 50})
    description : string;

    @Column({length : 1})
    etat : string;
}
