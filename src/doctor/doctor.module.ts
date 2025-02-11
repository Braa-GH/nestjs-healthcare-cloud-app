import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { UserModule } from 'src/user/user.module';
import { SpecialtyModule } from 'src/specialty/specialty.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), UserModule, SpecialtyModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
