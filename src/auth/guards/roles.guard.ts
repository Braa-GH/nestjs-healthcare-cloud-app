import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminService } from 'src/admin/admin.service';
import { Roles } from 'src/common/enums';
import { DoctorService } from 'src/doctor/doctor.service';
import { PatientService } from 'src/patient/patient.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private adminService: AdminService,
    private doctorService: DoctorService,
    private patientService: PatientService
  ){}

  canActivate(context: ExecutionContext){
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const user = request.user;

    const roles: Roles[] = this.reflector.get("roles", context.getHandler());
    const isAuthorized = roles.includes(user.role);
    console.log("Role:", user.role);
    
    
    if(isAuthorized){
      switch(user.role){
        case Roles.User:
          this.validate(user.userId, this.userService);
          break;
        case Roles.Admin:
          this.validate(user.adminId, this.adminService);
          break;
        case Roles.Doctor:
          this.validate(user.doctorId, this.doctorService);
          break;
        case Roles.Patient:
          this.validate(user.patientId, this.patientService);
          break;
      }
    }else{
      throw new UnauthorizedException(`Authorized roles: [${roles}]`);
    }
    return true;
  }

  validate(id: string, service: any){
    
    return service.findOne({id}).then(result => {
      if(!result){
        throw new UnauthorizedException();
      }
    }).catch(err => {
      throw err || new UnauthorizedException();
    });
  }
}
