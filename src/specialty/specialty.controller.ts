import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { ValidateSpecialtyIdPipe } from './pipes/validate-specialty-id.pipe';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SpecialtyExistPipe } from './pipes/specialty-exist.pipe';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Controller("specialty")
@ApiTags("Specialty Endpoints")
export class SpecialtyController {
    constructor(private specialtyService: SpecialtyService){}

    @Post(":specialtyName")
    @ApiOperation({summary: "Create New Specialty."})
    @ApiParam({name: "specialtyName", example: "Dermatologist"})
    async create(@Param("specialtyName") name: string){
        const specialty = await this.specialtyService.findOne({name});
        if(specialty)
            throw new ForbiddenException("Specialty with this name is already exist!")
        return await this.specialtyService.create(name);
    }

    @Get(":specialtyId")
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Get Specialty By ID."})
    @ApiParam({name: "specialtyId", example: "spec-481d"})
    async findOne(@Param("specialtyId", ValidateSpecialtyIdPipe) specialtyId: string){
        const specialty = await this.specialtyService.findOne({id:specialtyId});
        if(!specialty)
            throw new NotFoundException("specialty is not exist!")
        return specialty;
    }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Get All Specialties."})
    findAll(){
        return this.specialtyService.findAll();
    }

    @Patch(":specialtyId")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Update Specific Specialty."})
    @ApiParam({name: "specialtyId", example: "spec-481d"})
    updateSpecialty(
        @Param("specialtyId", ValidateSpecialtyIdPipe, SpecialtyExistPipe) specialtyId: string,
        @Body(ValidationPipe) dto: UpdateSpecialtyDto
    ){
        return this.specialtyService.update(specialtyId, dto);
    }
    
    @Delete(":specialtyId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({summary: "Delete Specific Specialty By ID."})
    @ApiParam({name: "specialtyId", example: "spec-481d"})
    deleteSpecialty(@Param("specialtyId", ValidateSpecialtyIdPipe, SpecialtyExistPipe) specialtyId: string){
        return this.specialtyService.delete(specialtyId);
    }
}
