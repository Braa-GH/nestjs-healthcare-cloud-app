import { IsNotEmpty, IsStrongPassword, ValidateIf } from "class-validator";
import { ValidatePatientIdPipe } from "src/patient/pipes/validate-patient-id.pipe";
import { ApiProperty } from "@nestjs/swagger";

export class PatientLoginDto {
    @IsNotEmpty()
    @ValidateIf((obj, val)=> {
        return new ValidatePatientIdPipe().transform(val, null as any) as any;
    })
    @ApiProperty({example: "pt-012025-3a60f4"})
    readonly patientId: string;

    @IsNotEmpty() @IsStrongPassword()
    @ApiProperty({example: "liLi2024#"})
    readonly password: string;
}