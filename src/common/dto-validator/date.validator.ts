import { BadRequestException } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";
import { isFuture,isValid, parseJSON } from "date-fns";

export class DateValidator implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        const date = parseJSON(new Date(value) as any);
        if(!isFuture(date))
            throw new BadRequestException("Time Should be in the future!");
        return true
    }
    
}