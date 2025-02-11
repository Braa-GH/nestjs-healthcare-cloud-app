import { IsNotEmpty, IsStrongPassword, ValidateIf } from "class-validator";
import { ValidateDoctorIdPipe } from "src/doctor/pipes/validate-doctor-id.pipe";
import { ApiProperty } from "@nestjs/swagger";

export class DoctorLoginDto {
    @IsNotEmpty()
    @ValidateIf((obj,val) => {
        return new ValidateDoctorIdPipe().transform(val, null as any) as any;
    })
    @ApiProperty({example: "dr-012025-fdf717"})
    doctorId: string;

    @IsNotEmpty() @IsStrongPassword()
    @ApiProperty({example: "liLi2024#"})
    password: string;
}