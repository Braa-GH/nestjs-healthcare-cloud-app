import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateSpecialtyIdPipe implements PipeTransform {
  transform(specialtyId: string, metadata: ArgumentMetadata) {
    if(!specialtyId.startsWith("spec-") || specialtyId.length !== 9)
      throw new BadRequestException("Invalid Specialty Id!")
    return specialtyId;
  }
}
