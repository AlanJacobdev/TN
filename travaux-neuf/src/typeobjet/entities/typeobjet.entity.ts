import { Item } from "src/item/entities/item.entity";
import { Sousitem } from "src/sousitem/entities/sousitem.entity";
import { Typeobjetrepere } from "src/typeobjetrepere/entities/typeobjetrepere.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"

@Entity('typeobjet')
export class Typeobjet {
    
    @OneToMany (() => Item, (item : Item) => item.codeObjet)
    @OneToMany (() => Sousitem, (sousitem : Sousitem) => sousitem.codeSousItem)
    @PrimaryColumn({length : 2})
    idType : string;

    @Column({length : 200})
    libelleType : string;
    
}