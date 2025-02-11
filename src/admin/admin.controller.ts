import { Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ValidateUserIdPipe } from 'src/user/pipes/validate-user-id.pipe';
import { UserExistPipe } from 'src/user/pipes/user-exist.pipe';
import { ValidateAdminIdPipe } from './pipes/validate-admin-id.pipe';
import { AdminExistPipe } from './pipes/admin-exist.pipe';

@Controller("admin")
@ApiTags("Admin Endpoints")
export class AdminController {
    constructor(private adminService: AdminService){}

    @Post(":userId")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({summary: "Make a User to be an Admin."})
    @ApiParam({name: "userId", example: "6ba1d8e7-df91-406d-89e8-0f475bbd7c2d", required: true, allowEmptyValue: false})
    async createAdmin(@Param('userId', ValidateUserIdPipe, UserExistPipe) userId: string){
        const admin = await this.adminService.findOne({userId});
        if(admin)
            throw new ForbiddenException("This user is already an admin!");
        return await this.adminService.create(userId);
    }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Get All Admins"})
    async findAll(){
        return this.adminService.findAll();
    }

    @Get(":adminId")
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Find Specific Admin By ID."})
    @ApiParam({name: "adminId", example: "ad-012025-42c9c3", required: true, allowEmptyValue: false})
    async findOne(@Param('adminId', ValidateAdminIdPipe) adminId: string){
        return this.adminService.findOne({id: adminId});
    }

    @Delete(":adminId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({summary: "Delete Specific Admin By ID."})
    @ApiParam({name: "adminId", example: "ad-012025-42c9c3", required: true, allowEmptyValue: false})
    removeAdmin(@Param('adminId', ValidateAdminIdPipe, AdminExistPipe) adminId: string){
        this.adminService.delete(adminId);
    }
}
