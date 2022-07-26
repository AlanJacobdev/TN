import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity('document')
export class Document {

    @PrimaryGeneratedColumn()
    idDoc : number

    @Column()
    idDocument : string

    @Column()
    nomDocument : string

    @Column({nullable:true})
    type : string

    @Column()
    path : string

    @Column()
    date : Date

    @Column()
    profil : string
}
