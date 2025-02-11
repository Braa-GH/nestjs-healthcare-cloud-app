import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [UserModule],
    controllers: [],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule {}
