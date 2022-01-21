import { IsNotEmpty } from "class-validator";

export class CreateAtelierDto {
    @IsNotEmpty()
    idAtelier : string;

    @IsNotEmpty()
    libelleAtelier : string;

}
