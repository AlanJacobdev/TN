import { Droitparutilisateur } from "src/droitparutilisateur/entities/droitparutilisateur.entity";
import { Service } from "src/service/entities/service.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('utilisateur')
export class Utilisateur {
    
    @OneToMany (() => Droitparutilisateur, (dpu : Droitparutilisateur) => dpu.idUtilisateur)
    @PrimaryGeneratedColumn()
    idUtilisateur: number;

    @Column({length : 200})
    nom : string;

    @Column({length : 200})
    prenom : string;


    @ManyToOne(() => Service)
    @JoinColumn({name: 'idService'})
    @Column({length : 50})
    idService : string;

    @Column()
    estAdministrateur : boolean;

}
