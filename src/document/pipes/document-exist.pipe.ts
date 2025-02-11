import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { DocumentService } from '../document.service';

@Injectable()
export class DocumentExistPipe implements PipeTransform {
  constructor(private documentService: DocumentService){}

  transform(documentId: any, metadata: ArgumentMetadata) {
    return this.documentService.findOne(documentId).then(doc => {
      if(!doc)
        throw new NotFoundException();
      return documentId;
    });
  }
}
