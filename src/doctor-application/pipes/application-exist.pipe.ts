import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { DoctorApplicationService } from '../doctor-application.service';

@Injectable()
export class ApplicationExistPipe implements PipeTransform {
  constructor(private doctorAppService: DoctorApplicationService){}
  
  transform(applicationId: any, metadata: ArgumentMetadata) {
    return this.doctorAppService.findOne({_id: applicationId}).then(result => {
      if(!result)
        throw new BadRequestException("Application is not exist!")
      return applicationId;
    }).catch(err => {
      throw err || new BadRequestException();
    })
  }
}
