
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class BodyNotEmptyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    //check value
    let count = 0;
    for(const prop in value)
        if(prop != null) count++;
    
    if(count == 0) throw new BadRequestException("Request Body Con not Be Empty!");
    return value;
  }
}
