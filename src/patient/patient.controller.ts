import { Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { UserExistPipe } from 'src/user/pipes/user-exist.pipe';
import { ValidateUserIdPipe } from 'src/user/pipes/validate-user-id.pipe';
import { ValidatePatientIdPipe } from 'src/patient/pipes/validate-patient-id.pipe';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PatientExistPipe } from './pipes/patient-exist.pipe';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums';
import { OwnerGuard } from 'src/auth/guards/owner.guard';

@Controller("patient")
@ApiTags("Patient Endpoints")
export class PatientController {
    constructor(private patientService: PatientService){}

    @Post(":userId")
    @HttpCode(HttpStatus.CREATED)
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "Make a user to be a patient", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    async createPatient(@Param('userId', ValidateUserIdPipe, UserExistPipe) userId: string){
        const patient = await this.patientService.findOne({userId});
        if(patient)
            throw new ForbiddenException("This user is already a patient!")
        return await this.patientService.create(userId);
        //send an email & notification with patient id to user
    }

    @Get(':patientId')
    @HttpCode(HttpStatus.FOUND)
    @Auth(OwnerGuard, Roles.Admin, Roles.Doctor, Roles.Owner)
    @ApiOperation({summary: "Find a patient by ID.", description: "Roles: [Admin,Doctor,Owner]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Patient-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiParam({name: "patientId", example: "pt-012025-217d83", required: true})
    async findOne(@Param("patientId", ValidatePatientIdPipe) patientId: string){
        const patient = await this.patientService.findOne({id: patientId});
        if(!patient)
            throw new NotFoundException("Patient is not exist!")
        return patient;
    }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @Auth(null, Roles.Admin, Roles.Doctor)
    @ApiOperation({summary: "Find All Patients, use 'limit' and 'page' for pagination.", description: "Roles: [Admin,Doctor]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiQuery({name: "limit", example: "100", required: false})
    @ApiQuery({name: "page", example: "1", required: false})
    findAll(
        @Query("limit", new ParseIntPipe({optional: true})) limit: number,
        @Query("page", new ParseIntPipe({optional: true})) page: number
    ){
        return this.patientService.findAll(limit = limit, page = page);
    }

    @Delete(":patientId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "Delete a patient by ID.", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "patientId", example: "pt-012025-217d83", required: false})
    deletePatient(@Param("patientId", ValidatePatientIdPipe, PatientExistPipe) patientId: string){
        return this.patientService.delete(patientId);
    }
}
