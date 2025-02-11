import { forwardRef, Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor]), forwardRef(() => ProvidersModule)
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService]
})
export class DoctorModule {}
