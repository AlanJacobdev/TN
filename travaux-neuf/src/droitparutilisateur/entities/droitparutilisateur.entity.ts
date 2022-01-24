import { Droit } from "src/droit/entities/droit.entity";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('droitparutilisateur')
export class Droitparutilisateur {

    @ManyToOne(() => Utilisateur)
    @JoinColumn({name: 'idUtilisateur'})
    @PrimaryColumn()
    idUtilisateur : number;

    @ManyToOne(() => Droit)
    @JoinColumn({name: 'idDroit'})
    @PrimaryColumn({length : 50})
    idDroit : string;

    @Column()
    valeur : boolean;

}
