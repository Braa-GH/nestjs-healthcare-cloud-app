import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from "uuid";

@Injectable()
export class ValidateUserIdPipe implements PipeTransform {
  transform(userId: any, metadata: ArgumentMetadata) {
    if(!userId) throw new BadRequestException("User ID Can Not Be Empty!");

    if(!validate(userId))
      throw new BadRequestException("Invalid User Id!");
    return userId;
  }
}
