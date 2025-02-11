import { Routes } from "@nestjs/core";
import { AdminModule } from "src/admin/admin.module";
import { AppModule } from "src/app.module";
import { AuthModule } from "src/auth/auth.module";
import { DoctorModule } from "src/doctor/doctor.module";
import { PatientModule } from "src/patient/patient.module";
import { SpecialtyModule } from "src/specialty/specialty.module";
import { UserModule } from "src/user/user.module";

export const routesConfig: Routes = [
    {
        path: "/api",
        children: [
            {
                path: "/",
                module: UserModule
            },
            {
                path: "/",
                module: PatientModule
            },
            {
                path: "/",
                module: AdminModule
            },
            {
                path: "/",
                module: SpecialtyModule
            },
            {
                path: "/",
                module: DoctorModule
            },
            {
                path: "/",
                module: AuthModule
            }
        ]
    },
    {
        "path": "/",
        module: AppModule
    }
]