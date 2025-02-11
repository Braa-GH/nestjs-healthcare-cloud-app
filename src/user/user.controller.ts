import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
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

@Controller("user")
@ApiTags("User Endpoints")
@ApiBearerAuth("JWT-Auth")
@ApiBearerAuth("Admin-Auth")
export class UserController {
    constructor(private userService: UserService){}

    @Get(":userId")
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Find specific user by ID"})
    @ApiParam({name: "userId", required: true, example: "5ecc9d58-5d2c-4a6b-aa04-3653b2c09c2b"})
    async findOne(@Param("userId") userId: string){
        const user = await this.userService.findOne({id: userId});
        if(!user)
            throw new NotFoundException("User Not Found!");
        return user;
    }

    @Get()
    @HttpCode(HttpStatus.FOUND)
    @ApiOperation({summary: "Find All Users"})
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
    @ApiOperation({summary: "Create New User"})
    async createUser(@Body(ValidationPipe) userDto: CreateUserDto){
        const isExist = await this.userService.findOne({email: userDto.email});
        if(isExist)
            throw new ForbiddenException("user with this email is already exist!");
        return this.userService.create(userDto);
    }

    @Patch(":userId")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({summary: "Update a specific user using ID"})
    @ApiParam({name: "userId", required: true, example: "5ecc9d58-5d2c-4a6b-aa04-3653b2c09c2b"})
    updateUser(
        @Param("userId", ValidateUserIdPipe) userId: string,
        @Body(BodyNotEmptyPipe, ValidationPipe) userDto: UpdateUserDto
    ){
        return this.userService.update(userId, userDto);
    }

    @Delete(":userId")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({summary: "Deleting a specific user by ID"})
    @ApiParam({name: "userId", required: true, example: "5ecc9d58-5d2c-4a6b-aa04-3653b2c09c2b"})
    deleteUser(@Param("userId", ValidateUserIdPipe) userId: string){
        return this.userService.delete(userId);
    }

    @Post('upload-profile-img')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor("profile-img", {
        storage: diskStorage({
            filename(req,file,cb){
                const name = randomUUID() + file.originalname;
                cb(null, name)
            },
            destination: PROFILE_IMG_PATH
        })
    }))
    @ApiOperation({summary: "upload profile image for a user!"})
    async uploadProfileImg(
        @UploadedFile(
            new ParseFilePipe({
                validators: [new ProfileImgValidator({})]
        })) image: Express.Multer.File
    ){
        // get user from request
        // store image name in user's record in db
        // if exist unlink and update
    }
}
