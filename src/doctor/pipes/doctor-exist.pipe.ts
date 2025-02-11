import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { DoctorService } from '../doctor.service';

@Injectable()
export class DoctorExistPipe implements PipeTransform {
  constructor(private doctorService: DoctorService){}

  async transform(doctorId: string, metadata: ArgumentMetadata) {
    const doctor = await this.doctorService.findOne({id: doctorId});
    if(!doctor)
      throw new NotFoundException("Doctor with this ID is not exist!")
    return doctorId;
  }
}
