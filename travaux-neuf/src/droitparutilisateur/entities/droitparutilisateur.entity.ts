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
