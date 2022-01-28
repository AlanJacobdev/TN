import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"

@Entity('typeobjet')
export class Typeobjet {
    
    @PrimaryColumn({length : 2})
    idType : string;

    @Column({length : 50})
    libelleType : string;
    
    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50})
    posteCreation : string;

    @Column({type : "datetime"})
    dateCreation : Date;

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;

    @Column({type : "datetime"})
    dateModification : Date;
    
}