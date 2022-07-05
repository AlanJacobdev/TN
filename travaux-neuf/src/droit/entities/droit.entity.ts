import { Droitparservice } from "src/droitparservice/entities/droitparservice.entity";
import { Droitparutilisateur } from "src/droitparutilisateur/entities/droitparutilisateur.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity('droit')
export class Droit {

    @PrimaryColumn({length:50})
    idDroit : string;

    @Column({length : 50})
    libelleDroit : string;

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50, nullable:true})
    posteCreation : string;

    @Column({type : "timestamp"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

    @Column({type : "timestamp", nullable:true})
    dateModification : Date;

}
