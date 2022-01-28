import { Numerounique } from 'src/numerounique/entities/numerounique.entity';
import { Typeobjetrepere } from 'src/typeobjetrepere/entities/typeobjetrepere.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('objetrepere')
export class Objetrepere {

    @PrimaryColumn({length : 6, unique: true})
    idObjetRepere : string;

    @Column({length : 50})
    libelleObjetRepere : string;

    @Column({length : 2})
    @ManyToOne(() => Typeobjetrepere)
    @JoinColumn({name: 'codeType'})
    codeType : string;
    
    @Column({length : 4})
    @ManyToOne(() => Numerounique)
    @JoinColumn({name: 'numeroUnique'})
    numeroUnique : string;

    @Column()
    valide : boolean

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50})
    posteCreation : string;

    @Column({type : "datetime"})
    dateCreation : Date;

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;

    @Column({type : "datetime"})
    dateModification : Date;

    @Column({length : 50})
    description : string;

}
