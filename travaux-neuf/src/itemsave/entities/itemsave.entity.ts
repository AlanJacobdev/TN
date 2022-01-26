import { Item } from "src/item/entities/item.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('itemsauvegarde')
export class Itemsave {
    
    @ManyToOne(() => Item)
    @JoinColumn({name: 'idItem'})
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
    
    @PrimaryColumn({type : "date"})
    date : Date

    @PrimaryColumn({type : "time"})
    heure : Date;

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;
    
    @Column({length : 50})
    description : string;

    @Column()
    etat : boolean;
}
