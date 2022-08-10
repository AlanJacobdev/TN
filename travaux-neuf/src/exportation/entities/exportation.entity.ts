import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

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
