import { Sousitem } from "src/sousitem/entities/sousitem.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

@Entity('sousitemsauvegarde')
export class Sousitemsave {

    @ManyToOne(() => Sousitem)
    @JoinColumn({name: 'idSousItem'})
    @PrimaryColumn({length : 20, type:"string"})
    idSousItem : string;
    
    @Column({length : 50})
    libelleSousItem: string;
    
    @Column({length : 12})
    idItem: string;
    
    @Column({length : 2})
    codeSousItem: string;
    
    @Column()
    securite : boolean;
    
    @Column()
    estPrefixe: boolean;
    
    @Column()
    actif: boolean;
    
    @PrimaryColumn({type : "date"})
    date : Date

    @PrimaryColumn({type : "time"})
    heure : Date;

    @Column({length : 50})
    profilModification : string;

    @Column({length : 50})
    posteModification : string;

    @Column({length : 50})
    description: string;

    @Column({length : 50})
    etat: string;

}
