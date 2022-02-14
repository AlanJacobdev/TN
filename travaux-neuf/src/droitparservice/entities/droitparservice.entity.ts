import { Droit } from "src/droit/entities/droit.entity";
import { Service } from "src/service/entities/service.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('droitparservice')
export class Droitparservice {

    @ManyToOne(() => Droit)
    @JoinColumn({name: 'idDroit'})
    @PrimaryColumn({length : 50})
    idDroit : string;

    @ManyToOne(() => Service)
    @JoinColumn({name: 'idService'})
    @PrimaryColumn({length : 50})
    idService : string;

    @Column()
    valeur : boolean;

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

}
