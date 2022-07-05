import { Description } from 'src/description/entities/description.entity';
import { Numerounique } from 'src/numerounique/entities/numerounique.entity';
import { Typeobjetrepere } from 'src/typeobjetrepere/entities/typeobjetrepere.entity';
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToOne, JoinTable, ManyToMany } from 'typeorm';

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
    @OneToOne(() => Numerounique)
    @JoinColumn({name: 'numeroUnique'})
    numeroUnique : string;

    @Column()
    etat : string

    @Column({length : 50})
    profilCreation : string;

    @Column({length : 50, nullable:true})
    posteCreation : string;

    @Column({type : "timestamp"})
    dateCreation : Date;

    @Column({length : 50, nullable:true})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

    @Column({type : "timestamp", nullable:true})
    dateModification : Date;

    @ManyToMany(() => Description)
    @JoinTable({name : "descriptionParObjetRepere"})
    description : Description[];

}
