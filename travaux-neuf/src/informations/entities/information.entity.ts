import { Document } from "src/document/entities/document.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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
