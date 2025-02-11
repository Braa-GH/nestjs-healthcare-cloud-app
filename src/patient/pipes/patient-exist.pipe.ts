import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { PatientService } from '../patient.service';

@Injectable()
export class PatientExistPipe implements PipeTransform {

  constructor(private patientService: PatientService){}

  async transform(patientId: any, metadata: ArgumentMetadata) {
    const patient = await this.patientService.findOne({id: patientId});
    if(!patient)
      throw new NotFoundException("Patient is not exist!");
    return patientId;
  }
}
