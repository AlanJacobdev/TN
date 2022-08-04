import { Atelier } from "src/atelier/entities/atelier.entity";
import { Typeobjetrepere } from "src/typeobjetrepere/entities/typeobjetrepere.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
/**
 * Fichier de configuration de la table role au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */

@Entity('role')
export class Role {

    @PrimaryGeneratedColumn()
    idRole : number

    @Column()
    libelleRole : string

    @Column()
    dateCreation : Date

    @Column()
    profilCreation : string

    @Column({nullable : true})
    dateModification : Date

    @Column({nullable : true})
    profilModification : string

    @ManyToMany(() => Atelier)
    @JoinTable({name : "atelierparrole"})
    atelier : Atelier[];

    @ManyToMany(() => Typeobjetrepere)
    @JoinTable({name : "TypeORparrole"})
    typeObjet : Typeobjetrepere[];


}
