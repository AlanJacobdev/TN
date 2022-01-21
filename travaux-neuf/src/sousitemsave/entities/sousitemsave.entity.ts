import { Sousitem } from "src/sousitem/entities/sousitem.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

@Entity('sousitemsauvegarde')
export class Sousitemsave {

    @ManyToOne(() => Sousitem)
    @JoinColumn({name: 'idSousItem'})
    @PrimaryColumn({length : 10, type:"string"})
    idSousItem : Sousitem;
    
    @Column({length : 200})
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
    
    @Column({length : 200})
    description: string;

    @Column({length : 200})
    etat: string;

}
