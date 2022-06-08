import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"

@Entity('typeobjet')
export class Typeobjet {
    
    @PrimaryColumn({length : 2})
    idType : string;

    @Column({length : 100})
    libelleType : string;
    
    @Column()
    actif : boolean;

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50, nullable:true})
    posteCreation : string;

    @Column({type : "datetime"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

    @Column({type : "datetime", nullable:true})
    dateModification : Date;
    
}