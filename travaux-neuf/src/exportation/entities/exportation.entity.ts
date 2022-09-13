import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

/**
 * Fichier de configuration de la table exportation au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */


@Entity('exportation')
export class Exportation {
    
    @PrimaryGeneratedColumn()
    idExport : number

    @Column()
    nomDocument : string;

    @Column()
    path : string

    @Column()
    date : Date

    @Column()
    profil : string

}
