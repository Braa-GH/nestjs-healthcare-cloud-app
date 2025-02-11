import { ValidateIf } from "class-validator";
import { ValidateSpecialtyIdPipe } from "src/specialty/pipes/validate-specialty-id.pipe";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDoctorDto {
    @ValidateIf((obj, val) => {
        return new ValidateSpecialtyIdPipe().transform(val, null as any) as any;
    })
    @ApiProperty({example: "spec-5c95"})
    specialtyId: string;
}