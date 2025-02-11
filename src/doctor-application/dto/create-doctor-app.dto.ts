import { IsNotEmpty, IsString, ValidateIf } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ValidateSpecialtyIdPipe } from "src/specialty/pipes/validate-specialty-id.pipe";

export class CreateDoctorApplicationDto {
    @ValidateIf((obj, val) => {
        return new ValidateSpecialtyIdPipe().transform(val, null) as any;
    })
    @ApiProperty({example: "spec-5c95"})
    specialtyId: string;
}