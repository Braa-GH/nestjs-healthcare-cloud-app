import { Routes } from "@nestjs/core";
import { UserModule } from "src/user/user.module";

export const routesConfig: Routes = [
    {
        path: "/api",
        children: [
            {
                path: "/",
                module: UserModule
            }
        ]
    }
]