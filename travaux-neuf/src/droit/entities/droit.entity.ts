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
