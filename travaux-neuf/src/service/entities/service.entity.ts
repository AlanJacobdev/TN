import { Droitparservice } from "src/droitparservice/entities/droitparservice.entity";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('service')
export class Service {
    
    @OneToMany (() => Utilisateur, (uti : Utilisateur) => uti.idService)
    @OneToMany (() => Droitparservice, (dps : Droitparservice) => dps.idService)
    @PrimaryColumn({length : 50})
    idService : string;

    @Column({length : 50})
    libelleService : string;

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50})
    posteCréation : string;

    @Column({type : "datetime"})
    dateCreation : Date;

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;

    @Column({type : "datetime"})
    dateModification : Date;
}
