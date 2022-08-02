import { Document } from "src/document/entities/document.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

/**
 * Fichier de configuration de la table information au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */

@Entity('information')
export class Information {

    @PrimaryGeneratedColumn()
    idInfo : number

    @Column()
    titre : string

    @Column()
    text : string

    @ManyToMany(() => Document)
    @JoinTable({name : "documentParInfo"})
    document : Document[];

    @Column()
    profilCreation : string

    @Column()
    dateCreation : Date

    @Column({nullable:true})
    profilModification : string

    @Column({nullable:true})
    dateModification : Date


}
