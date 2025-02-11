import { ConfigService } from "@nestjs/config";
import { DataSourceOptions } from "typeorm";
import { DbTypes } from "src/common/enums";

const dataSourceOptionsTypeOrm = (configService: ConfigService): DataSourceOptions => {
    return {
        type: configService.get<DbTypes>("dbType"),
        host: configService.get<string>("dbHost"),
        port:configService.get<number>("dbPort"),
        username: configService.get<string>("dbUsername"),
        password: configService.get<string>("dbPassword"),
        database: configService.get<string>("dbName"),
        entities: ['dist/**/*.entity.js'],
        synchronize: true, 
        migrations: ['dist/db/migrations/*.js'],
    }
}

export default dataSourceOptionsTypeOrm;