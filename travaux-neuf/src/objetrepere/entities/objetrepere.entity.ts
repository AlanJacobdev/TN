
import { Numerounique } from 'src/numerounique/entities/numerounique.entity';
import { Orsave } from 'src/orsave/entities/orsave.entity';
import { Typeobjetrepere } from 'src/typeobjetrepere/entities/typeobjetrepere.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('objetrepere')
export class Objetrepere {

    @OneToMany (() => Orsave, (ORS : Orsave) => ORS.idObjetRepere)
    @PrimaryColumn({length : 6, unique: true})
    idObjetRepere : string;

    @Column({length : 200})
    libelleObjetRepere : string;

    @Column({length : 2})
    @ManyToOne(() => Typeobjetrepere)
    @JoinColumn({name: 'codeType'})
    codeType : Typeobjetrepere;
    
    @Column({length : 4, type : "string"})
    @ManyToOne(() => Numerounique)
    @JoinColumn({name: 'numeroUnique'})
    numeroUnique : Numerounique;

    @Column()
    valide : boolean

    @Column({type : "date"})
    dateCreation : Date

    @Column({length : 200})
    profilCreation : string;

    @Column({length : 200})
    description : string;

}
