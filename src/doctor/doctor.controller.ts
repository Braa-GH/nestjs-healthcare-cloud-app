import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { ValidateUserIdPipe } from 'src/user/pipes/validate-user-id.pipe';
import { UserExistPipe } from 'src/user/pipes/user-exist.pipe';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ValidateDoctorIdPipe } from './pipes/validate-doctor-id.pipe';
import { DoctorExistPipe } from './pipes/doctor-exist.pipe';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { SpecialtyService } from 'src/specialty/specialty.service';
import { BodyNotEmptyPipe } from 'src/common/pipes/validate-body.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums';
import { OwnerGuard } from 'src/auth/guards/owner.guard';
import { DoctorApplicationService } from 'src/doctor-application/doctor-application.service';

@Controller("doctor")
@ApiTags("Doctor Endpoints")
export class DoctorController {
    constructor(
        private doctorService: DoctorService,
        private specialtyService: SpecialtyService,
        private doctorAppService: DoctorApplicationService
    ){}

    @Post(":userId")
    @Auth(null, Roles.Admin)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: "Create New Doctor.", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "userId", example: "6ba1d8e7-df91-406d-89e8-0f475bbd7c2d"})
    async createDoctor(
        @Param("userId", ValidateUserIdPipe, UserExistPipe) userId: string,
        @Body(BodyNotEmptyPipe, ValidationPipe) doctorDto: CreateDoctorDto
    ){
        //ensure that user is not already a doctor
        const doctor = await this.doctorService.findOne({userId});
        if(doctor)
            throw new ForbiddenException("This user is already a doctor!")
        
        // check if specialty is exist
        const specialty = await this.specialtyService.findOne({id: doctorDto.specialtyId});
        if(!specialty)
            throw new NotFoundException("Given Specialty Is Not Exist!")
        
        return await this.doctorService.create(userId, doctorDto);
            
    }

    @Get()
    @Auth(null, Roles.Admin, Roles.Doctor, Roles.Patient)
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Get All Doctors.", description: "Roles: [Admin,Doctor,Patient]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiQuery({name: "limit", example: 100, required: false})
    @ApiQuery({name: "page", example: 1, required: false})
    findAll(
        @Query("limit", new ParseIntPipe({optional: true})) limit: number,
        @Query("page", new ParseIntPipe({optional: true})) page: number,
    ){
        return this.doctorService.findAll(limit = limit, page = page);
    }

    @Get(":doctorId")
    @Auth(null, Roles.Admin, Roles.Patient, Roles.Doctor)
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Find A Doctor By ID.", description: "Roles: [Admin,Patient,Doctor]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    @ApiParam({name: "doctorId", example: "dr-012025-e93fa9"})
    async findOne(@Param("doctorId", ValidateDoctorIdPipe) doctorId: string){
        const doctor = await this.doctorService.findOne({id: doctorId});
        if(!doctor)
            throw new NotFoundException("Doctor is not exist!");
        const { documents, degree } = await this.doctorAppService.findOne({_id: doctor.applicationId});
        return {...doctor, documents, degree};
    }

    @Patch(":doctorId")
    @HttpCode(HttpStatus.OK)
    @Auth(OwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "Update A Doctor By ID.", description: "Roles: [Admin,Owner]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiParam({name: "doctorId", example: "dr-012025-e93fa9"})
    async updateDoctor(
        @Param("doctorId", ValidateDoctorIdPipe, DoctorExistPipe) doctorId: string,
        @Body(BodyNotEmptyPipe, new ValidationPipe({whitelist: true})) updateDoctorDto: UpdateDoctorDto
    ){
        return await this.doctorService.update(doctorId, updateDoctorDto);
    }

    @Delete(":doctorId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "Delete A Doctor By ID.", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "doctorId", example: "dr-012025-e93fa9"})
    async deleteDoctor(@Param("doctorId", ValidateDoctorIdPipe, DoctorExistPipe) doctorId: string){
        return this.doctorService.delete(doctorId);
    }
}
