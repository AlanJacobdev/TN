import { Item } from "src/item/entities/item.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('description')
export class Description {
    
    @PrimaryGeneratedColumn()
    idDescription : number;

    @Column()
    lien : string;

}
