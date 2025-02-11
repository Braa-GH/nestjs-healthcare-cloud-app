import { IsDateString, ValidateBy, IsNumber, IsOptional } from 'class-validator';
import { DateValidator } from 'src/common/dto-validator/date.validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAppointmentDto {
    @IsOptional() @IsDateString({strict: true, strictSeparator: true})
    @ValidateBy({name: DateValidator.name, validator: new DateValidator()})
    @ApiProperty({example: "2025-10-01T04:00:00"})
    readonly startTime: string | any;

    @IsOptional() @IsNumber({allowInfinity:false, allowNaN: false})
    @ApiProperty({example: 25})
    readonly periodInMinutes: number;
}
