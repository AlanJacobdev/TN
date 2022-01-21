import { Typeobjetrepere } from "src/typeobjetrepere/entities/typeobjetrepere.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"

@Entity('typeobjet')
export class Typeobjet {
    
    @OneToMany (() => Typeobjet, (TypeO : Typeobjet) => TypeO.idType)
    @PrimaryColumn({length : 2})
    idType : string;

    @Column({length : 200})
    libelleType : string;
    
}