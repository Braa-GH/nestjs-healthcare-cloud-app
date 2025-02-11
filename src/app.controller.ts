import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Auth } from './auth/decorators/auth.decorator';
import { ApiBearerAuth } from "@nestjs/swagger";
import { All_Roles } from './common/constants';
import { Request } from 'express';

@Controller()
export class AppController {
    @Get("profile")
    @Auth(null, ...All_Roles)
    @ApiBearerAuth("JWT-Admin-Auth") @ApiBearerAuth("JWT-User-Auth")
    @ApiBearerAuth("JWT-Doctor-Auth") @ApiBearerAuth("JWT-Patient-Auth")
    profile(@Req() req){
        return req.user;
    }

    @Get("cookies")
    getCookies(@Req() req: Request){
        console.log(req.cookies);
    }
}
