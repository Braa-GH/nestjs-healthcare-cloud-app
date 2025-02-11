import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./auth-strategies/jwt.strategy";
import { PatientModule } from "src/patient/patient.module";
import { DoctorModule } from "src/doctor/doctor.module";
import { AdminModule } from "src/admin/admin.module";

@Module({
    imports: [
        UserModule, PatientModule, DoctorModule, AdminModule, JwtModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}