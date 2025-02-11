import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { ParseMongoIdPipe } from "src/common/pipes/parse-mongoId.pipe";
import { BodyNotEmptyPipe } from "src/common/pipes/validate-body.pipe";
import { User } from "src/common/decorators/user.decorator";
import { Auth } from "src/auth/decorators/auth.decorator";
import { All_Roles } from "src/common/constants";
import { Roles } from "src/common/enums";
import { DocumentOwnerGuard } from "./guards/document-owner.guard";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from "@nestjs/swagger";

@Controller("document")
@ApiTags("Document Endpoints")
export class DocumentController {
    constructor(private documentService: DocumentService){}

    @Post()
    @Auth(null,...All_Roles)
    @ApiOperation({summary: "create a document for application.", description: "Roles: [All_Roles]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiBearerAuth("JWT-Patient-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    createDocument(@Body(ValidationPipe) documentDto: CreateDocumentDto, @User() user){
        return this.documentService.create(documentDto, user.userId);
    }

    @Get()
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "Get all document.", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    findAll(){
        return this.documentService.findAll();
    }

    @Get(":documentId")
    @Auth(DocumentOwnerGuard, Roles.Admin, Roles.Doctor, Roles.Owner)
    @ApiOperation({summary: "Find a document by ID.", description: "Roles: [Admin,Doctor,Owner]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiBearerAuth("JWT-Patient-Auth") @ApiBearerAuth("JWT-User-Auth")
    findOne(@Param("documentId", ParseMongoIdPipe) documentId: string){
        return this.documentService.findOne(documentId);
    }

    @Patch(":documentId")
    @Auth(DocumentOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "Update a document by ID.", description: "Roles: [Admin,Owner]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiBearerAuth("JWT-Patient-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "documentId", example: "677c58c8317e261efb814e6b"})
    updateDocument(
        @Param("documentId", ParseMongoIdPipe) documentId: string,
        @Body(BodyNotEmptyPipe, ValidationPipe) documentDto: UpdateDocumentDto
    ){
        return this.documentService.update(documentId,documentDto);
    }

    @Delete(":documentId")
    @Auth(DocumentOwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "Delete a document by ID.", description: "Roles: [Admin, Owner]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiBearerAuth("JWT-Patient-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "documentId", example: "677c58c8317e261efb814e6b"})
    deleteDocument(@Param("documentId", ParseMongoIdPipe) documentId: string){
        return this.documentService.delete(documentId);
    }
}