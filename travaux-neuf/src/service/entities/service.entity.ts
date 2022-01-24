import { Droitparservice } from "src/droitparservice/entities/droitparservice.entity";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('service')
export class Service {
    
    @OneToMany (() => Utilisateur, (uti : Utilisateur) => uti.idService)
    @OneToMany (() => Droitparservice, (dps : Droitparservice) => dps.idService)
    @PrimaryColumn({length : 50})
    idService : string;

    @Column({length : 200})
    libelleService : string;

}
