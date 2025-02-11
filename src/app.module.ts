import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from 'src/config/env.validation';
import configuration from 'src/config/env-configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceOptionsTypeOrm from 'src/config/db/typeorm-data-source';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseDataOptions } from 'src/config/db/mongoose-data-options';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.development.env', '.production.env'],
      validate: validateEnv,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return dataSourceOptionsTypeOrm(configService);
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return mongooseDataOptions(configService);
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
