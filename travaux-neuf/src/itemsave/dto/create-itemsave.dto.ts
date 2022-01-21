import { IsNotEmpty } from "class-validator";

export class CreateItemsaveDto {

    @IsNotEmpty()
    idItem : string;
    
    @IsNotEmpty()
    libelleItem : string;
    
    @IsNotEmpty()
    idOR : string;
    
    @IsNotEmpty()
    numeroUnique : string;
    
    @IsNotEmpty()
    digit : number;
    
    @IsNotEmpty()
    codeObjet : string;
    
    @IsNotEmpty()
    securite : boolean;
   
    @IsNotEmpty()
    actif : boolean
  
    @IsNotEmpty()
    date : Date

    @IsNotEmpty()
    heure : Date;
    
    @IsNotEmpty()
    description : string;

    @IsNotEmpty()
    etat : boolean;

}
