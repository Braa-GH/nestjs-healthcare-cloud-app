import { Body, Controller, ForbiddenException, HttpCode, HttpStatus, Post, ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { UserLoginDto } from "./dto/user-login.dto";
import { AuthService } from "./auth.service";
import { PatientLoginDto } from "./dto/patient-login.dto";
import { BodyNotEmptyPipe } from "src/common/pipes/validate-body.pipe";
import { DoctorLoginDto } from "./dto/doctor-login";
import { AdminLoginDto } from "./dto/admin-login.dto";

@Controller("auth")
@ApiTags("Authentication Endpoints")
export class AuthController {
    constructor(private userService: UserService, private authService: AuthService){}

    @Post("signup")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: "Signup to create basic user account."})
    async signup(@Body(ValidationPipe) userDto: CreateUserDto){
        if(await this.userService.findOne({email: userDto.email}))
            throw new ForbiddenException("user with this email is already exist!");
        return await this.userService.create(userDto);
    }

    @Post("user-login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Login as a basic User."})
    userLogin(@Body(ValidationPipe) userLoginDto: UserLoginDto){
        return this.authService.userLogin(userLoginDto); 
    }

    @Post("patient-login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Login as a Patient."})
    patientLogin(@Body(BodyNotEmptyPipe,ValidationPipe) patientLoginDto: PatientLoginDto){
        return this.authService.patientLogin(patientLoginDto); 
    }

    @Post("doctor-login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Login as a Doctor."})
    doctorLogin(@Body(BodyNotEmptyPipe,ValidationPipe) doctorLoginDto: DoctorLoginDto){
        return this.authService.doctorLogin(doctorLoginDto); 
    }

    @Post("admin-login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Login as an Admin."})
    adminLogin(@Body(BodyNotEmptyPipe,ValidationPipe) adminLoginDto: AdminLoginDto){
        return this.authService.adminLogin(adminLoginDto); 
    }

}