import { forwardRef, Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from "@nestjs/mongoose";
import { PatientApplication, PatientApplicationSchema } from './patient-application.schema';
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Patient]),
        MongooseModule.forFeature([{name: PatientApplication.name, schema: PatientApplicationSchema}]),
        forwardRef(() => ProvidersModule)
    ],
    controllers: [PatientController],
    providers: [PatientService],
    exports: [PatientService]
})
export class PatientModule {}
