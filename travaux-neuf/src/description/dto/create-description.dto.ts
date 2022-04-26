import { IsNotEmpty } from "class-validator";

export class CreateDescriptionDto {

    @IsNotEmpty()
    lien : string

}
