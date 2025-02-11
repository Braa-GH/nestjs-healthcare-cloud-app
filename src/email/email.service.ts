import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from "nodemailer";
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmailService {
    private email: string;
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService, private userService: UserService){
        this.email = configService.get<string>("smtpEmail") as string;
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: false,
            auth: {
                user: this.email,
                pass: this.configService.get<string>("smtpEmailPassword")
            },
        });
    }

    async sendEmail(text: string, target: string){
        const message = `
        <h2>Nestjs Healthcare Cloud App</h2>
        <p>
            ${text}
        </p>
        `
        return await this.transporter.sendMail({
            html: message,
            from: this.email,
            to: target,
            subject: "Nestjs Server is Listining!",
            text: "New Message"
        })
    }

    async sendPatientAcceptEmail(userId: string, patientId: string){
        const user = await this.userService.findOne({id: userId});
        if (!user) {
            throw new Error('User not found');
        }
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
        const user = await this.userService.findOne({id: userId}) as User;
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
        const user = await this.userService.findOne({id: userId}) as User;
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
        const user = await this.userService.findOne({id: userId}) as User;
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
