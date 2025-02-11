import { Module } from '@nestjs/common';
import { DateHandlerService } from './date-handler.service';

@Module({
    providers: [DateHandlerService],
    exports: [DateHandlerService]
})
export class DateHandlerModule {}
