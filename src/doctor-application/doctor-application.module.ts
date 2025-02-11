import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';
import { DoctorApplicationController } from './doctor-application.controller';
import { DoctorApplication, DoctorApplicationSchema } from './doctor-application.schema';
import { DoctorApplicationService } from './doctor-application.service';

@Module({
    imports: [
        MongooseModule.forFeature([{name: DoctorApplication.name, schema: DoctorApplicationSchema}]),
        forwardRef(() => ProvidersModule)
    ],
    controllers: [DoctorApplicationController],
    providers: [DoctorApplicationService],
    exports: [DoctorApplicationService]
})
export class DoctorApplicationModule {}
