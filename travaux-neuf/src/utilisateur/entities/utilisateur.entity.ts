import { Droitparutilisateur } from "src/droitparutilisateur/entities/droitparutilisateur.entity";
import { Service } from "src/service/entities/service.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('utilisateur')
export class Utilisateur {
    
   
    @PrimaryGeneratedColumn()
    idUtilisateur: number;

    @Column({length : 50})
    nom : string;

    @Column({length : 50})
    prenom : string;

    @ManyToOne(() => Service)
    @JoinColumn({name: 'idService'})
    @Column({length : 50})
    idService : string;

    @Column()
    estAdministrateur : boolean;

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
