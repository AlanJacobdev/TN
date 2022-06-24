import { IsNotEmpty } from 'class-validator';
export class UpdateDemandeAdminDto {

    etat : boolean;

    @IsNotEmpty()
    isDelete : boolean;

    @IsNotEmpty()
    profilModification : string;

    dateModification : Date;
}
