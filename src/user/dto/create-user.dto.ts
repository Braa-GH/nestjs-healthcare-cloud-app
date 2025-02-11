import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { Sex } from "src/common/enums";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class CreateUserDto {
    @IsNotEmpty() @IsString()
    @ApiProperty({example: "Lili"})
    readonly firstName: string;

    @IsNotEmpty() @IsString()
    @ApiProperty({example: "GH"})
    readonly lastName: string;

    @IsNotEmpty() @IsEmail() @Exclude({toPlainOnly: true})  // to not be used in UpdateDto class
    @ApiProperty({example: "liligh@gmail.com"})
    readonly email: string;

    @IsNotEmpty() @IsStrongPassword() @Exclude({toPlainOnly: true})  // to not be used in UpdateDto class
    @ApiProperty({example: "liLi2024#"})
    readonly password: string;

    @IsNotEmpty() @IsDateString({strict: true})
    @ApiProperty({example: "2023-10-07"})
    readonly dob: Date;

    @IsNotEmpty() @IsEnum(Sex)
    @ApiProperty({example: "female", enum: Sex})
    readonly sex: string;

    @IsOptional() @IsPhoneNumber()
    @ApiPropertyOptional({example: "+972598848308"})
    readonly phone?: string;

    @IsOptional() @IsString()
    @ApiPropertyOptional({example: "Palestine, Gaza Strip, Gaza city"})
    readonly location?: string;
}