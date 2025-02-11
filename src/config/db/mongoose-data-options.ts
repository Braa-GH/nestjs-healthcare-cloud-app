import { ConfigService } from "@nestjs/config";
import { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

export const mongooseDataOptions = (configService: ConfigService):MongooseModuleFactoryOptions => {
    return {
        uri: configService.get("mongoURI")
    }
}