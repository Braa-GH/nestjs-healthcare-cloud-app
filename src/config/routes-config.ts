import { Routes } from "@nestjs/core";
import { PatientModule } from "src/patient/patient.module";
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
            }
        ]
    }
]