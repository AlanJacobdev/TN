import { IsNotEmpty } from "class-validator";

export class CreateTypeobjetrepereDto {

    @IsNotEmpty()
    idTypeOR : string;

    @IsNotEmpty()
    libelleTypeOR : string;

}