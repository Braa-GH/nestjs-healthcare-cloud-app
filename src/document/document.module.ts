import { forwardRef, Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Document, documentSchema } from './document.schema';
import { ProvidersModule } from 'src/common/dependencies-provider/providers.module';

@Module({
    imports: [
        MongooseModule.forFeature([{name: Document.name, schema: documentSchema}]),
        forwardRef(() => ProvidersModule)
    ],
    controllers: [DocumentController],
    providers: [DocumentService],
})
export class DocumentModule {}
