import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Roles } from 'src/common/enums';
import { DoctorApplicationService } from '../doctor-application.service';

@Injectable()
export class ApplicationOwnerGuard implements CanActivate {
  constructor(private doctorAppService: DoctorApplicationService){}

  canActivate(context: ExecutionContext){
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const {userId} = request.user;
    const { applicationId } = request.params;
    return this.doctorAppService.findOne({_id: applicationId}).then(result => {
      if(result && result.userId == userId)
        request.user.role = Roles.Owner;
      return true;
    }).catch(err => {
      throw err || new UnauthorizedException();
    })
  }
}
