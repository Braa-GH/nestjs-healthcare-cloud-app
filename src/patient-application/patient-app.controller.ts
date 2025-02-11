import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums';
import { PatientApplicationService } from './patient-application.service';
import { OwnerGuard } from 'src/auth/guards/owner.guard';
import { ValidateUserIdPipe } from 'src/user/pipes/validate-user-id.pipe';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongoId.pipe';
import { DocumentService } from 'src/document/document.service';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ApplicationOwnerGuard } from './guards/application-owner.guard';
import { PatientService } from 'src/patient/patient.service';
import { ApplicationExistPipe } from 'src/doctor-application/pipes/application-exist.pipe';
import { UserExistPipe } from 'src/user/pipes/user-exist.pipe';
import { EmailService } from 'src/email/email.service';
import { PatientApplication } from './patient-application.schema';

@Controller("patient-application")
@ApiTags("Patient-Application Endpoints")
export class PatientApplicationController {
    constructor(
        private patientAppService: PatientApplicationService,
        private documentService: DocumentService,
        private patientService: PatientService,
        private emailService: EmailService
    ){}

    @Post(":userId")
    @Auth(OwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "create patient application for a user",description: "Roles: [Admin, Owner-User]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "userId", example: "4ba68bb1-3c3d-47fa-94d5-a1620d8969d5"})
    async createApplication(@Param("userId", ValidateUserIdPipe, UserExistPipe) userId: string){
        return this.patientAppService.create(userId);
    }

    @Get(":userId")
    @Auth(OwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "Get patient application for a user",description: "Roles: [Admin, Owner-User]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "userId", example: "4ba68bb1-3c3d-47fa-94d5-a1620d8969d5"})
    async getApplication(@Param("userId", ValidateUserIdPipe, UserExistPipe) userId: string){
        return this.patientAppService.findOne({userId});
    }

    @Delete(":applicationId")
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "delete patient application.", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "applicationId", example: "677da26cb0a98a0bf2167d49"})
    async deleteApplication(@Param("applicationId", ParseMongoIdPipe, ApplicationExistPipe) applicationId: string){
        return this.patientAppService.delete({_id: applicationId});
    }

    @Patch("accept/:applicationId")
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "accept patient application for a patient", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "applicationId", example: "677da26cb0a98a0bf2167d49"})
    async acceptApplication(@Param("applicationId", ParseMongoIdPipe, ApplicationExistPipe) applicationId: string){
        const application = await this.patientAppService.accept({_id: applicationId}) as PatientApplication;
        const patient = await this.patientService.create(application.userId, applicationId);
        //send Email with ID
        await this.emailService.sendPatientAcceptEmail(application.userId, patient._id);
        return patient;
    }

    @Patch("reject/:applicationId")
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "reject patient application for a patient", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "applicationId", example: "677da26cb0a98a0bf2167d49"})
    async rejectApplication(@Param("applicationId", ParseMongoIdPipe, ApplicationExistPipe) applicationId: string){
        const application = await this.patientAppService.reject({_id: applicationId}) as PatientApplication;
        //send Email with ID
        await this.emailService.sendPatientRejectionEmail(application.userId);
        return application;
    }

    @Post("add-document/:applicationId")
    @Auth(ApplicationOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "add document to patient application.", description: "Roles: [Admin,Owner-User]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "applicationId", example: "677da26cb0a98a0bf2167d49"})
    async addDocument(
        @Param("applicationId", ParseMongoIdPipe, ApplicationExistPipe) applicationId: string,
        @Body(ValidationPipe) documentDto: CreateDocumentDto,
        @User() user
    ){
        const document = await this.documentService.create(documentDto, user.userId);
        return await this.patientAppService.addDocument({_id: applicationId}, document);
    }

}
