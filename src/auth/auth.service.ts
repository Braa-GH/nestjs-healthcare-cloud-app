import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { UserLoginDto } from "./dto/user-login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PatientService } from "src/patient/patient.service";
import { PatientLoginDto } from "./dto/patient-login.dto";
import { DoctorService } from "src/doctor/doctor.service";
import { DoctorLoginDto } from "./dto/doctor-login";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminService } from "src/admin/admin.service";
import { Roles } from "src/common/enums";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private patientService: PatientService,
        private doctorService: DoctorService,
        private adminService: AdminService,
        private configService: ConfigService,
        private jwtService: JwtService
    ){}
    
    async userLogin({email,password}: UserLoginDto){
        const user = await this.userService.findOne({email});
        if(!user)
            throw new NotFoundException("user with this email is not exist!")
        const validatePassword = await this.userService.validatePassword(user.id, password);
        if(!validatePassword)
            throw new UnauthorizedException("Invalid Password!");
        const payload = {userId: user.id, email: user.email, role: Roles.User};
        return this.generateToken(payload);
    }

    async patientLogin({patientId,password}: PatientLoginDto){
        const patient = await this.patientService.findOne({id: patientId});
        if(!patient)
            throw new BadRequestException("Invalid Patient ID!")
        const validatePassword = await this.userService.validatePassword(patient.user, password);
        if(!validatePassword)
            throw new BadRequestException("Invalid Password!");
        const payload = {
            patientId, userId: patient.user, role: Roles.Patient
        }
        return this.generateToken(payload);
    }

    async doctorLogin({doctorId,password}: DoctorLoginDto){
        const doctor = await this.doctorService.findOne({id: doctorId});
        if(!doctor)
            throw new BadRequestException("Invalid Doctor ID!")
        const validatePassword = await this.userService.validatePassword(doctor.user, password);
        if(!validatePassword)
            throw new BadRequestException("Invalid Password!");
        const payload = {
            doctorId, userId: doctor.user, role: Roles.Doctor
        }
        return this.generateToken(payload);
    }

    async adminLogin({adminId,password}: AdminLoginDto){
        const admin = await this.adminService.findOne({id: adminId});
        if(!admin)
            throw new BadRequestException("Invalid Admin ID!")
        const validatePassword = await this.userService.validatePassword(admin.user, password);
        if(!validatePassword)
            throw new BadRequestException("Invalid Password!");
        const payload = {
            adminId, userId: admin.user, role: Roles.Admin
        }
        return this.generateToken(payload);
    }

    private generateToken(payload: object){
        const secretKey = this.configService.get<string>("jwtSecretKey");
        return {
            token: this.jwtService.sign(payload, {secret: secretKey, expiresIn: "7d"})
        }
    }

}