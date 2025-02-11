import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { User } from 'src/user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User,Patient])],
    controllers: [PatientController],
    providers: [PatientService],
})
export class PatientModule {}
