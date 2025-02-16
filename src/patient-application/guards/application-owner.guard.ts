import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PatientApplicationService } from '../patient-application.service';
import { Roles } from 'src/common/enums';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class ApplicationOwnerGuard implements CanActivate {
  constructor(
    private patientAppService: PatientApplicationService,
    private patientService: PatientService
  ){}

  canActivate(context: ExecutionContext): any{
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const {userId, patientId} = request.user;
    const { applicationId } = request.params;
    if(patientId){
      return this.patientService.findOne({id: patientId}).then(res => {
        if(res && res.applicationId == applicationId){
          request.user.role = Roles.Owner;
          return true;
        }
      })
    }
    return this.patientAppService.findOne({_id: applicationId}).then(result => {      
      if(result && result.userId == userId)
        request.user.role = Roles.Owner;
      return true;
    }).catch(err => {
      throw err || new UnauthorizedException();
    })
  }
}
