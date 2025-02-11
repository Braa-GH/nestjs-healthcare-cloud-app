import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Auth } from './auth/decorators/auth.decorator';
import { Roles } from './common/enums';

@Controller()
export class AppController {
    @Get("profile")
    @Auth(Roles.Admin, Roles.Doctor, Roles.Patient, Roles.User)
    profile(@Req() req){
        return req.user;
    }
}
