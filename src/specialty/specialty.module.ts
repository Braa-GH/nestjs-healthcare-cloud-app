import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from './specialty.entity';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';

@Module({
  imports: [TypeOrmModule.forFeature([Specialty])],
  controllers: [SpecialtyController],
  providers: [SpecialtyService],
})
export class SpecialtyModule {}
