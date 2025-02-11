import { BadRequestException } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";
import { isFuture,isValid, parseJSON } from "date-fns";

export class DateValidator implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        const date = parseJSON(value);
        if(!isValid(date))
            throw new BadRequestException("Invalid Time!");
        if(!isFuture(date))
            throw new BadRequestException("Time Should be in the future!");
        return true
    }
    
}