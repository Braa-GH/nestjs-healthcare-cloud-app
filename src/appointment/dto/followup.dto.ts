import { IsDateString, IsNotEmpty, IsNumber, ValidateBy } from "class-validator";
import { DateValidator } from "src/common/dto-validator/date.validator";
import { ApiProperty } from "@nestjs/swagger";

export class FollowupDto {
    @IsNotEmpty() @IsDateString({strict: true, strictSeparator: true})
    @ValidateBy({name: DateValidator.name, validator: new DateValidator()})
    @ApiProperty({example: "2025-10-01T04:00:00"})
    readonly startTime: string | any;

    @IsNotEmpty() @IsNumber({allowInfinity:false, allowNaN: false})
    @ApiProperty({example: 25})
    readonly periodInMinutes: number;
    
}