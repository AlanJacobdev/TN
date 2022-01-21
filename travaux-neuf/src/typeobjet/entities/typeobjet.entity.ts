import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity('typeobjet')
export class Typeobjet {
    
    @PrimaryColumn({length : 2})
    idType : string;

    @Column({length : 200})
    libelleType : string;
    
}