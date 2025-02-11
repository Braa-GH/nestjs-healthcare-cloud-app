import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/common/enums';

/**
 * This Guard is to Add "Owner" Role to the user,
 * if request sender Id, and param are similar.
 */
@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext){
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const user = request.user;
    const {userId, adminId, doctorId, patientId} = request.params;
    console.log("params:",request.params);
    
    if(
      (userId && user.userId == userId) ||
      (adminId && user.adminId == adminId) ||
      (doctorId && user.doctorId == doctorId) ||
      (patientId && user.patientId == patientId)
    ){
      request.user.role = Roles.Owner;
    }
    return true;
  }
}
