import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from "@nestjs/swagger";
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums';
import { OwnerGuard } from 'src/auth/guards/owner.guard';
import { ValidateUserIdPipe } from 'src/user/pipes/validate-user-id.pipe';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongoId.pipe';
import { DocumentService } from 'src/document/document.service';
import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import { User } from 'src/common/decorators/user.decorator';
import { ApplicationOwnerGuard } from './guards/application-owner.guard';
import { DoctorApplicationService } from './doctor-application.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { ApplicationExistPipe } from './pipes/application-exist.pipe';
import { UserExistPipe } from 'src/user/pipes/user-exist.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { DOCUMENT_FILES_PATH } from 'src/common/paths';
import { DocumentFileValidator } from 'src/common/file-validators/document-files.validator';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { CreateDoctorApplicationDto } from './dto/create-doctor-app.dto';
import { BodyNotEmptyPipe } from 'src/common/pipes/validate-body.pipe';

@Controller("doctor-application")
@ApiTags("Doctor-Application Endpoints")
export class DoctorApplicationController {
    constructor(
        private doctorAppService: DoctorApplicationService,
        private documentService: DocumentService,
        private doctorService: DoctorService
    ){}

    @Post(":userId")
    @Auth(OwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "create doctor application for a user",description: "Roles: [Admin, Owner-User]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "userId", example: "4ba68bb1-3c3d-47fa-94d5-a1620d8969d5"})
    async createApplication(
        @Param("userId", ValidateUserIdPipe, UserExistPipe) userId: string,
        @Body(ValidationPipe, BodyNotEmptyPipe) appDto: CreateDoctorApplicationDto
    ){
        return this.doctorAppService.create(userId, appDto);
    }

    @Get(":userId")
    @Auth(OwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "Get doctor application for a user",description: "Roles: [Admin, Owner-User]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "userId", example: "4ba68bb1-3c3d-47fa-94d5-a1620d8969d5"})
    async getApplication(@Param("userId", ValidateUserIdPipe) userId: string){
        return this.doctorAppService.findOne({userId});
    }

    @Delete(":applicationId")
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "delete doctor application.", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "applicationId", example: "677da26cb0a98a0bf2167d49"})
    async deleteApplication(@Param("applicationId", ParseMongoIdPipe, ApplicationExistPipe) applicationId: string){
        return this.doctorAppService.delete({_id: applicationId});
    }

    @Patch("accept/:applicationId")
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "accept doctor application for a user", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "applicationId", example: "677da26cb0a98a0bf2167d49"})
    async acceptApplication(@Param("applicationId", ParseMongoIdPipe, ApplicationExistPipe) applicationId: string){
        await this.doctorAppService.accept({_id: applicationId});
        const application = await this.doctorAppService.findOne({_id: applicationId});
        const doctor = await this.doctorService.create(application.userId, {
            specialtyId: application.specialtyId, applicationId
        });
        //send Email with ID
        return doctor;
    }

    @Post("add-document/:applicationId")
    @Auth(ApplicationOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "add document to doctor application.", description: "Roles: [Admin,Owner-User]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "applicationId", example: "677da26cb0a98a0bf2167d49"})
    async addDocument(
        @Param("applicationId", ParseMongoIdPipe, ApplicationExistPipe) applicationId: string,
        @Body(ValidationPipe) documentDto: CreateDocumentDto,
        @User() user
    ){
        const document = await this.documentService.create(documentDto, user.userId);
        await this.doctorAppService.addDocument({_id: applicationId}, document);
        return document;
    }

    @Post("upload-degree/:applicationId")
    @Auth(ApplicationOwnerGuard, Roles.Admin, Roles.Owner)
    @UseInterceptors(FileInterceptor("degree-file", {
        storage: diskStorage({
            filename(req, file, cb) {
                const name = randomUUID() + file.originalname;
                cb(null, name)
            },
            destination: DOCUMENT_FILES_PATH
        })
    }))
    @ApiOperation({summary: "upload degree file to doctor application.", description: "Roles: [Admin,Owner-User]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "applicationId", example: "677da26cb0a98a0bf2167d49"})
    async uploadDegree(
        @Param("applicationId", ParseMongoIdPipe, ApplicationExistPipe) applicationId: string,
        @UploadedFile(new ParseFilePipe({
            validators: [new DocumentFileValidator({})]
        })) degreeFile: Express.Multer.File
    ){
        const application = await this.doctorAppService.findOne({_id: applicationId});
        if(application.degree){
            try{
                const path = join(DOCUMENT_FILES_PATH, application.degree);
                unlinkSync(path);
            }catch(err){}
        }
        return await this.doctorAppService.addDegree({_id: applicationId}, degreeFile.filename);
    }

}
