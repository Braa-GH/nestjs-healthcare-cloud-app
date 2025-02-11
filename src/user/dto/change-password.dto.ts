import { IsNotEmpty, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
    @IsNotEmpty() @IsStrongPassword()
    @ApiProperty({example: "liLi2024#"})
    readonly oldPassword: string;

    @IsNotEmpty() @IsStrongPassword()
    @ApiProperty({example: "liLi2025#"})
    readonly newPassword: string;
}