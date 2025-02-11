import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PatientApplicationService } from '../patient-application.service';
import { Roles } from 'src/common/enums';

@Injectable()
export class ApplicationOwnerGuard implements CanActivate {
  constructor(private patientAppService: PatientApplicationService){}

  canActivate(context: ExecutionContext){
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const {userId} = request.user;
    const { applicationId } = request.params;
    return this.patientAppService.findOne({_id: applicationId}).then(result => {      
      if(result && result.userId == userId)
        request.user.role = Roles.Owner;
      return true;
    }).catch(err => {
      throw err || new UnauthorizedException();
    })
  }
}
