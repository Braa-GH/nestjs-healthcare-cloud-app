import { plainToInstance } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsString, validateSync } from "class-validator";

enum Environment { 
   Development = "development", 
   Production = "production", 
   Testing = "testing", 
   Provision = "provision" 
};

export class EnvironmentVariables {
    @IsEnum(Environment)
    readonly NODE_ENV: Environment;

    @IsNumber()
    readonly PORT: number;

    @IsString()
    readonly JWT_Secret_Key: string;

    //DB TypeOrm Config

    @IsString()
    readonly DB_HOST: string;

    @IsNumber()
    readonly DB_PORT: number;

    @IsString()
    readonly DB_USERNAME: string;

    @IsString()
    readonly DB_PASSWORD: string;

    @IsString()
    readonly DB_NAME: string;

    //DB MongoDb Config
    @IsString()
    readonly MONG_URI: string;

    //Mailing Config
    @IsEmail()
    readonly SMTP_EMAIL: string;

    @IsString()
    readonly SMTP_EMAIL_PASSWORD: string;

}

export function validateEnv(config: Record<string, unknown>){
    // console.log("config", config);
    const validatedConfig = plainToInstance(EnvironmentVariables, config, { 
        enableImplicitConversion: true
    });
    // console.log("validated config", validatedConfig);

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false
    });

    if(errors.length > 0){
        throw new Error(errors.toString());
    }
    return validatedConfig;
}

