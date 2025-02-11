import { ConfigService } from "@nestjs/config";
import { DbTypes } from "src/common/types/db";
import { DataSourceOptions } from "typeorm";

const dataSourceOptionsTypeOrm = (configService: ConfigService): DataSourceOptions => {
    return {
        type: configService.get<DbTypes>("dbType") as DbTypes,
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