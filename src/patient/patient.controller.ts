import { Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { PatientService } from './patient.service';
import { UserExistPipe } from 'src/common/pipes/user-exist.pipe';
import { ValidateUserIdPipe } from 'src/common/pipes/validate-user-id.pipe';
import { ValidatePatientIdPipe } from 'src/common/pipes/validate-patient-id.pipe';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@Controller("patient")
@ApiTags("Patient Endpoints")
export class PatientController {
    constructor(private patientService: PatientService){}

    // admin guard
    @Post(":userId")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: "Make a user to be a patient"})
    async createPatient(@Param('userId', ValidateUserIdPipe, UserExistPipe) userId: string){
        const patient = await this.patientService.findOne({userId});
        if(patient)
            throw new ForbiddenException("This user is already a patient!")
        return this.patientService.create(userId);
        //send an email & notification with patient id to user
    }

    @Get(':patientId')
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Find a patient by ID."})
    @ApiParam({name: "patientId", example: "pt-012025-217d83", required: true})
    async findOne(@Param("patientId", ValidatePatientIdPipe) patientId: string){
        const patient = await this.patientService.findOne({id: patientId});
        if(!patient)
            throw new NotFoundException("Patient is not exist!")
        return patient;
    }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Find All Patients, use 'limit' and 'page' for pagination."})
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
    @ApiOperation({summary: "Delete a patient by ID."})
    @ApiParam({name: "patientId", example: "pt-012025-217d83", required: false})
    deletePatient(@Param("patientId", ValidatePatientIdPipe) patientId: string){
        return this.patientService.delete(patientId);
    }
}
