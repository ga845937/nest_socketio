import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class ReadUserRequest {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    public name: string;
}

export interface IReadUserResponse {
    id: string,
    name: string,
}
