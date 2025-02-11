import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from "uuid";

@Injectable()
export class ValidateUserIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(!validate(value))
      throw new BadRequestException("Invalid User Id!");
    return value;
  }
}
