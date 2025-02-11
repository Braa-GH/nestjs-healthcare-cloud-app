import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialty } from './specialty.entity';
import { SpecialtyController } from './specialty.controller';
import { SpecialtyService } from './specialty.service';
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialty]),
    forwardRef(() => ProvidersModule)
  ],
  controllers: [SpecialtyController],
  providers: [SpecialtyService],
  exports: [SpecialtyService]
})
export class SpecialtyModule {}
