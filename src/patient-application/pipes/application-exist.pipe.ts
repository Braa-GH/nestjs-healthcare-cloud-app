import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { PatientApplicationService } from '../patient-application.service';

@Injectable()
export class ApplicationExistPipe implements PipeTransform {
  constructor(private patientAppService: PatientApplicationService){}
  
  transform(applicationId: any, metadata: ArgumentMetadata) {
    return this.patientAppService.findOne({_id: applicationId}).then(result => {
      if(!result)
        throw new BadRequestException("Application is not exist!")
      return applicationId;
    }).catch(err => {
      throw err || new BadRequestException();
    })
  }
}
