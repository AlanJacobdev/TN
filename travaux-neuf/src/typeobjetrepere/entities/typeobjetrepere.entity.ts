import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('typeobjetrepere')
export class Typeobjetrepere {

    @PrimaryColumn({length : 2})
    idTypeOR : string;

    @Column({length : 100})
    libelleTypeOR : string;

    @Column({length : 50})
    profilCreation : string;

    @Column()
    actif: boolean

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
