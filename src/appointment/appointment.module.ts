import { forwardRef, Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Appointment, appointmentSchema } from './appointment.schema';
import { DateHandlerModule } from 'src/common/date-handler/date-handler.module';
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Appointment.name, schema: appointmentSchema}]),
        DateHandlerModule,
        forwardRef(() => ProvidersModule)
    ],
    controllers: [AppointmentController],
    providers: [AppointmentService],
})
export class AppointmentModule {}
