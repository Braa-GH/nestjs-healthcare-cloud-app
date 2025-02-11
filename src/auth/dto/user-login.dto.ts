import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {
    @IsNotEmpty() @IsEmail()
    @ApiProperty({example: "lili@gmail.com"})
    email: string;

    @IsNotEmpty() @IsStrongPassword()
    @ApiProperty({example: "liLi2024#"})
    password: string;
}