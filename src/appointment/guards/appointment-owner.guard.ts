import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AppointmentService } from '../appointment.service';
import { Roles } from 'src/common/enums';

@Injectable()
export class AppointmentOwnerGuard implements CanActivate {
  constructor(private appointmentService: AppointmentService){}
  canActivate(context: ExecutionContext){
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { doctorId, patientId } = request.user;
    const { appointmentId } = request.params;
    return this.appointmentService.findOne({_id:appointmentId}).then(result => {
      if(result && (result.doctorId == doctorId || result.patientId == patientId))
        request.user.role = Roles.Owner;
      return true;
    }).catch(err => {
      throw err;
    })
  }
}
