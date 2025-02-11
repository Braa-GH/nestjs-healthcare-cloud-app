import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDocumentDto {
    @IsNotEmpty() @IsString()
    @ApiProperty({example: "CT Scan"})
    readonly title: string;

    @IsOptional() @IsString()
    @ApiPropertyOptional({example: "photo of CT Scan, scanned at 2020"})
    readonly description: string;
}