import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer";
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
    private email: string;
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService, private userService: UserService){
        this.email = configService.get<string>("email");
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.email,
                pass: this.configService.get<string>("emailPassword")
            }
        });
    }

    async sendPatientAcceptEmail(userId: string, patientId: string){
        const user = await this.userService.findOne({id: userId});
        const target = user.email;
        const message = `
        <h2>${user.firstName} ${user.lastName}</h2>
        <p>
            Your Patient Application Have Been <span style="color:green">Accepted</span>
            <br/>
            Your Patient ID is: <span style="font-weight: bold;color: orangered">${patientId}</span>
            <br/>
            <span style="text-transform: capitalize;color: yellow">TRY NOT TO SHARE IT WITH SOMEONE ELSE!</span>
            you can use your Patient ID to login as a Patient, and benefit of all patient features.
            <br/> 
            your password is still the same.
        </p>
        `
        return await this.transporter.sendMail({
            html: message,
            from: this.email,
            to: target,
            subject: "Patient Application Accepted!"
        })
    }

    async sendPatientRejectionEmail(userId: string){
        const user = await this.userService.findOne({id: userId});
        const target = user.email;
        const message = `
        <h2>${user.firstName} ${user.lastName}</h2>
        <p>
            Your Patient Application Is <span style="color:red">Rejected</span>
        </p>
        `
        return await this.transporter.sendMail({
            html: message,
            from: this.email,
            to: target,
            subject: "Patient Application Rejection!"
        })
    }

    async sendDoctorAcceptEmail(userId: string, doctorId: string){
        const user = await this.userService.findOne({id: userId});
        const target = user.email;
        const message = `
        <h2>${user.firstName} ${user.lastName}</h2>
        <p>
            Your Doctor Application Have Been <span style="color:green">Accepted</span>
            <br/>
            Your Doctor ID is: <span style="font-weight: bold;color: orangered">${doctorId}</span>
            <br/>
            <span style="text-transform: capitalize;color: yellow">TRY NOT TO SHARE IT WITH SOMEONE ELSE!</span>
            <br/>
            you can use your Doctor ID to login as a Doctor, and benefit of all doctor features.
            <br/> 
            your password is still the same.
        </p>
        `
        return await this.transporter.sendMail({
            html: message,
            from: this.email,
            to: target,
            subject: "Doctor Application Accepted!"
        })
    }

    async sendDoctorRejectionEmail(userId: string){
        const user = await this.userService.findOne({id: userId});
        const target = user.email;
        const message = `
        <h2>${user.firstName} ${user.lastName}</h2>
        <p>
            Your Doctor Application Is <span style="color:red">Rejected</span>
        </p>
        `
        return await this.transporter.sendMail({
            html: message,
            from: this.email,
            to: target,
            subject: "Doctor Application Rejection!"
        })
    }
}
