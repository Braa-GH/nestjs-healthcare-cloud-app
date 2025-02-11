import { forwardRef, Module } from '@nestjs/common';
import { PatientApplicationController } from './patient-app.controller';
import { PatientApplicationService } from './patient-application.service';
import { MongooseModule } from "@nestjs/mongoose";
import { PatientApplication, PatientApplicationSchema } from './patient-application.schema';
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: PatientApplication.name, schema: PatientApplicationSchema}]),
        forwardRef(() => ProvidersModule)
    ],
    controllers: [PatientApplicationController],
    providers: [PatientApplicationService],
    exports: [PatientApplicationService]
})
export class PatientApplicationModule {}
