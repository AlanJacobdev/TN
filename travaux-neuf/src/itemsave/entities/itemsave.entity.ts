import { Description } from "src/description/entities/description.entity";
import { Item } from "src/item/entities/item.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";

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
    
    @Column({nullable:false})
    etat : string
    
    @PrimaryColumn({type : "timestamp"})
    date : Date

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;
    
    @ManyToMany(() => Description)
    @JoinTable({name : "descriptionParItemSave"})
    description : Description[];

    @Column({length : 1})
    status : string;
}
