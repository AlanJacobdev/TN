import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

/**
 * Fichier de configuration de la table document au sein de la base
 * Plus d'informations https://typeorm.io/entities
 */

@Entity('document')
export class Document {

    @PrimaryGeneratedColumn()
    idDoc : number

    @Column()
    idDocument : string

    @Column()
    libelleDocument : string;

    @Column()
    nomDocument : string

    @Column()
    type : string

    @Column()
    path : string

    @Column()
    date : Date

    @Column()
    profil : string
}
