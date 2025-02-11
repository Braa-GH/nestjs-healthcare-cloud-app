import { IsNotEmpty, IsStrongPassword, ValidateIf } from "class-validator";
import { ValidateAdminIdPipe } from "src/admin/pipes/validate-admin-id.pipe";
import { ApiProperty } from "@nestjs/swagger";

export class AdminLoginDto {
    @ValidateIf((obj, val) => {
        return ValidateAdminIdPipe.prototype.transform(val, null) as any;
    })
    @ApiProperty({example: "ad-012025-8f9b68"})
    readonly adminId: string;

    @IsNotEmpty() @IsStrongPassword()
    @ApiProperty({example: "liLi2024#"})
    readonly password: string;
}