import { Role } from "src/role/entities/role.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('utilisateur')
export class Utilisateur {
    
    @PrimaryGeneratedColumn()
    idUtilisateur: number;

    @Column({length : 50})
    nom : string;

    @Column({length : 50})
    prenom : string;

    @Column()
    password : string

    @Column({unique : true})
    login : string;

    @Column()
    email : string;

    @Column({default: true})
    estActif : boolean;

    @ManyToOne(() => Role)
    @JoinColumn({name: 'idRole'})
    @Column({nullable : true})
    idRole : number

    @Column()
    estAdministrateur : boolean;

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

    @Column({ nullable: true,name:'refreshtoken' })
    refreshToken: string;
  
    @Column({ type: 'date', nullable: true, name:'refreshtokenexp' })
    refreshTokenExp: string;
    
}
