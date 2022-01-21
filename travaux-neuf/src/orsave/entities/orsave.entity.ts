import { Objetrepere } from "src/objetrepere/entities/objetrepere.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

@Entity('objetreperesauvegarde')
export class Orsave {
    
    @ManyToOne(() => Objetrepere)
    @JoinColumn({name: 'idObjetRepere'})
    @PrimaryColumn({type :"string"})
    idObjetRepere : Objetrepere;

    @Column({length : 200})
    libelleObjetRepere : string;
    
    @Column({length : 2})
    codeType : string;

    @Column({length : 4})
    numeroUnique : string;

    @Column()
    valide : boolean;

    @Column({length: 200})
    description: string;

    @Column()
    etat : boolean;

    @PrimaryColumn({type : "date"})
    date : Date

    @PrimaryColumn({type : "time"})
    heure : Date;

}
