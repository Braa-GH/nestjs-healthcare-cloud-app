import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { ValidateSpecialtyIdPipe } from './pipes/validate-specialty-id.pipe';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SpecialtyExistPipe } from './pipes/specialty-exist.pipe';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums';

@Controller("specialty")
@ApiTags("Specialty Endpoints")
export class SpecialtyController {
    constructor(private specialtyService: SpecialtyService){}

    @Post(":specialtyName")
    @Auth(null, Roles.Admin, Roles.Doctor)
    @ApiOperation({summary: "Create New Specialty.", description: "Roles: [Admin,Doctor]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-Doctor-Auth")
    @ApiParam({name: "specialtyName", example: "Dermatologist"})
    async create(@Param("specialtyName") name: string){
        const specialty = await this.specialtyService.findOne({name});
        if(specialty)
            throw new ForbiddenException("Specialty with this name is already exist!")
        return await this.specialtyService.create(name);
    }

    @Get(":specialtyId")
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Get Specialty By ID.", description: "Roles: [No_Roles]"})
    @ApiParam({name: "specialtyId", example: "spec-481d"})
    async findOne(@Param("specialtyId", ValidateSpecialtyIdPipe) specialtyId: string){
        const specialty = await this.specialtyService.findOne({id:specialtyId});
        if(!specialty)
            throw new NotFoundException("specialty is not exist!")
        return specialty;
    }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Get All Specialties.", description: "Roles: [No_Roles]"})
    findAll(){
        return this.specialtyService.findAll();
    }

    @Patch(":specialtyId")
    @Auth(null, Roles.Admin)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Update Specific Specialty.", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "specialtyId", example: "spec-481d"})
    updateSpecialty(
        @Param("specialtyId", ValidateSpecialtyIdPipe, SpecialtyExistPipe) specialtyId: string,
        @Body(ValidationPipe) dto: UpdateSpecialtyDto
    ){
        return this.specialtyService.update(specialtyId, dto);
    }
    
    @Delete(":specialtyId")
    @Auth(null, Roles.Admin)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({summary: "Delete Specific Specialty By ID.", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "specialtyId", example: "spec-481d"})
    deleteSpecialty(@Param("specialtyId", ValidateSpecialtyIdPipe, SpecialtyExistPipe) specialtyId: string){
        return this.specialtyService.delete(specialtyId);
    }
}
