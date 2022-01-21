import { IsNotEmpty } from "class-validator";

export class CreateTypeobjetDto {

    @IsNotEmpty()
    idType : string;

    @IsNotEmpty()
    libelleType : string;
}
