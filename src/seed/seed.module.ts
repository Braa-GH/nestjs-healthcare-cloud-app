import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';

@Module({
    imports: [AdminModule],
    controllers: [],
    providers: [],
})
export class SeedModule {}
