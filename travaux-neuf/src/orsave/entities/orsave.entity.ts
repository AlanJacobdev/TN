import { Description } from "src/description/entities/description.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm"

@Entity('objetreperesauvegarde')
export class Orsave {
    
    @PrimaryColumn({length : 6})
    idObjetRepere : string;

    @Column({length : 50})
    libelleObjetRepere : string;
    
    @Column({length : 2})
    codeType : string;

    @Column({length : 4})
    numeroUnique : string;

    @Column()
    etat : string;

    @ManyToMany(() => Description)
    @JoinTable({name : "descriptionParObjetRepereSave"})
    description : Description[];

    @Column({ length : 1})
    status : String ;

    @PrimaryColumn({type : "timestamp"})
    date : Date
    
    @Column({length : 50})
    profilModification : string;

    @Column({length : 50, nullable:true})
    posteModification : string;

}
