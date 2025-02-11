import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateDoctorIdPipe implements PipeTransform {
  transform(doctorId: string, metadata: ArgumentMetadata) {
    const parts = doctorId.split("-");
    if(doctorId.length !== 16 ||
       parts.length !== 3 ||
       parts[0] !== "dr" ||
       parts[1].length !== 6 ||
       parts[2].length !== 6
      )
      throw new BadRequestException("Invalid Patient ID!")
    return doctorId;
  }
}
