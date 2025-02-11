import { IsDateString, IsNotEmpty, IsNumber, ValidateIf, ValidateBy } from "class-validator";
import { DateValidator } from "src/common/dto-validator/date.validator";
import { ValidateDoctorIdPipe } from "src/doctor/pipes/validate-doctor-id.pipe";
import { ValidatePatientIdPipe } from "src/patient/pipes/validate-patient-id.pipe";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAppointmentDto {
    @ValidateIf((obj, val) => {
        return new ValidatePatientIdPipe().transform(val, null as any) as any;
    })
    @ApiProperty({example: "pt-012025-b26cb6"})
    readonly patientId: string;

    @ValidateIf((obj, val) => {
        return new ValidateDoctorIdPipe().transform(val, null as any) as any;
    })
    @ApiProperty({example: "dr-012025-3f00f9"})
    readonly doctorId: string;

    @IsNotEmpty() @IsDateString({strict: true, strictSeparator: true})
    @ValidateBy({name: DateValidator.name, validator: new DateValidator()})
    @ApiProperty({example: "2025-10-01T04:00:00"})
    readonly startTime: string | any;

    @IsNotEmpty() @IsNumber({allowInfinity:false, allowNaN: false})
    @ApiProperty({example: 25})
    readonly periodInMinutes: number;

}