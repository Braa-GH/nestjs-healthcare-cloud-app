import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';

@Module({
    imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => ProvidersModule)],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule {}
