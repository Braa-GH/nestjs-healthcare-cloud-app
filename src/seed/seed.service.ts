import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin } from 'src/admin/admin.entity';
import { AdminService } from 'src/admin/admin.service';
import { Sex } from 'src/common/enums';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SeedService {
    constructor(
        private userService: UserService,
        private adminService: AdminService,
        private configService: ConfigService,
        private emailService: EmailService
    ){}

    async seedRootAdmin(){
        const admins = await this.adminService.findAll();
        if(admins.length == 0){
            const email = this.configService.get<string>("smtpEmail") as string;
            const password =  "admin@Password100";
            const user: User = await this.userService.create({
                firstName: "Root",
                lastName: "Admin",
                email,
                password,
                dob: new Date("2023-10-07"),
                sex: Sex.male
            });
            if(user){
                const admin: Admin = await this.adminService.create(user.id);
                this.emailService.sendEmail(`
                    <h1>Root Admin is created</h1>
                    your root admin Id is: ${admin.id} <br>
                    your password is: ${password} </br>
                    <span style="color:red">Notice: change this password after you recieve it.</span> 
                `, email);
                return admin;
            }
        }
    }
}
