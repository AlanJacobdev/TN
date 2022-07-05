import { Droitparservice } from "src/droitparservice/entities/droitparservice.entity";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('service')
export class Service {
    

    @PrimaryColumn({length : 50})
    idService : string;

    @Column({length : 50})
    libelleService : string;

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50, nullable:true})
    posteCreation : string;

    @Column({type : "timestamp"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50,  nullable:true})
    posteModification : string;

    @Column({type : "timestamp", nullable:true})
    dateModification : Date;
}
