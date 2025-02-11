import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateAdminIdPipe implements PipeTransform {
  transform(patientId: string, metadata: ArgumentMetadata) {
    const parts = patientId.split("-");
    if(patientId.length !== 16 ||
       parts.length !== 3 ||
       parts[0] !== "ad" ||
       parts[1].length !== 6 ||
       parts[2].length !== 6
      )
      throw new BadRequestException("Invalid Patient ID!")
    return patientId;
  }
}
