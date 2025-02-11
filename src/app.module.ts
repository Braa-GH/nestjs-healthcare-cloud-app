import { DocumentModule } from './document/document.module';
import { AppController } from './app.controller';
import { SpecialtyModule } from './specialty/specialty.module';
import { DoctorModule } from './doctor/doctor.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from 'src/config/env.validation';
import configuration from 'src/config/env-configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceOptionsTypeOrm from 'src/config/db/typeorm-data-source';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseDataOptions } from 'src/config/db/mongoose-data-options';
import { routesConfig } from './config/routes-config';
import { PatientModule } from './patient/patient.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Admin } from './admin/admin.entity';
import { Doctor } from './doctor/doctor.entity';
import { Patient } from './patient/patient.entity';
import { ProvidersModule } from './common/dependencies-provider/providers.module';

@Module({
  imports: [
    ProvidersModule,
    DocumentModule,
    AuthModule,
    SpecialtyModule,
    DoctorModule,
    AdminModule,
    UserModule,
    PatientModule,
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
    TypeOrmModule.forFeature([User, Admin, Doctor, Patient]),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return mongooseDataOptions(configService);
      },
    }),
    // RouterModule.register(routesConfig),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
