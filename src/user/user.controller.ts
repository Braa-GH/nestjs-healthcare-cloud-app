import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from "@nestjs/swagger";
import { UpdateUserDto } from './dto/update-user.dto';
import { BodyNotEmptyPipe } from 'src/common/pipes/validate-body.pipe';
import { ValidateUserIdPipe } from 'src/user/pipes/validate-user-id.pipe';
import { FileInterceptor } from "@nestjs/platform-express";
import { PROFILE_IMG_PATH } from 'src/common/paths';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { ProfileImgValidator } from 'src/common/file-validators/profile-img.validator';
import { unlinkSync } from 'fs';
import { join } from 'path';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums';
import { User } from 'src/common/decorators/user.decorator';
import { OwnerGuard } from '../auth/guards/owner.guard';

@Controller("user")
@ApiTags("User Endpoints")
export class UserController {
    constructor(private userService: UserService){}

    @Get(":userId")
    @HttpCode(HttpStatus.FOUND)
    @Auth(OwnerGuard, Roles.Admin, Roles.Owner)
    @ApiOperation({summary: "Find specific user by ID",description: "Roles: [Admin,Owner]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "userId", required: true, example: "5ecc9d58-5d2c-4a6b-aa04-3653b2c09c2b"})
    async findOne(@Param("userId") userId: string){
        const user = await this.userService.findOne({id: userId}) as any;
        if(!user)
            throw new NotFoundException("User Not Found!");
        delete user.password;
        return user;
    }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "Find All Users", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiQuery({name: "limit", example: "100", required: false})
    @ApiQuery({name: "page", example: "1", required: false})
    findAll(
        @Query("limit", new ParseIntPipe({optional: true})) limit: number,
        @Query("page", new ParseIntPipe({optional: true})) page: number
    ){
        return this.userService.findAll(limit = limit, page = page);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "Create New User", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    async createUser(@Body(ValidationPipe) userDto: CreateUserDto){
        const isExist = await this.userService.findOne({email: userDto.email});
        if(isExist)
            throw new ForbiddenException("user with this email is already exist!");
        return this.userService.create(userDto);
    }

    @Patch("change-password")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: "change user password.", description: "Roles: [Owner]"})
    @ApiBearerAuth("JWT-User-Auth")
    changePassword(@Body(ValidationPipe) passwordDto: ChangePasswordDto, @User() user){
        const userId = user.userId;
        const { oldPassword, newPassword } = passwordDto;
        return this.userService.changePassword(userId, oldPassword, newPassword);
    }

    @Patch(":userId")
    @HttpCode(HttpStatus.OK)
    @Auth(OwnerGuard, Roles.Owner, Roles.Admin)
    @ApiOperation({summary: "Update a specific user using ID"})
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiParam({name: "userId", required: true, example: "5ecc9d58-5d2c-4a6b-aa04-3653b2c09c2b"})
    updateUser(
        @Param("userId", ValidateUserIdPipe) userId: string,
        @Body(BodyNotEmptyPipe, new ValidationPipe({whitelist: true})) userDto: UpdateUserDto
    ){
        return this.userService.update(userId, userDto);
    }

    @Delete(":userId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Auth(null, Roles.Admin)
    @ApiOperation({summary: "Deleting a specific user by ID", description: "Roles: [Admin]"})
    @ApiBearerAuth("JWT-Admin-Auth")
    @ApiParam({name: "userId", required: true, example: "5ecc9d58-5d2c-4a6b-aa04-3653b2c09c2b"})
    deleteUser(@Param("userId", ValidateUserIdPipe) userId: string){
        return this.userService.delete(userId);
    }

    @Post('upload-profile-img')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtAuthGuard)
    @ApiOperation({summary: "Upload Profile Image.", description: "Roles: [Owner]"})
    @ApiBearerAuth("JWT-User-Auth")
    @UseInterceptors(FileInterceptor("profile-img", {
        storage: diskStorage({
            filename(req,file,cb){
                const name = randomUUID() + file.originalname;
                cb(null, name)
            },
            destination: PROFILE_IMG_PATH
        })
    }))
    @UseGuards(JwtAuthGuard)
    async uploadProfileImg(
        @User() user,
        @UploadedFile(
            new ParseFilePipe({
                validators: [new ProfileImgValidator({})]
        })) image: Express.Multer.File
    ){
        const { userId } = user;
        const result = await this.findOne(userId);
        if(result.profileImg){
            const path = join(PROFILE_IMG_PATH, result.profileImg);
            try{
                unlinkSync(path);
            }catch(err){
                console.log("err")
            }
        }
        return await this.userService.update(userId, {profileImg: image.filename});
    }
}
