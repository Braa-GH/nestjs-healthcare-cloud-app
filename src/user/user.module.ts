import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => ProvidersModule)
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
