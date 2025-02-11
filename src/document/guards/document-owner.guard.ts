import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Roles } from 'src/common/enums';
import { DocumentService } from '../document.service';

@Injectable()
export class DocumentOwnerGuard implements CanActivate {
  constructor(private documentService: DocumentService){}

  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const {userId} = request.user;
    const documentId = request.params.documentId;
    return this.documentService.findOne(documentId).then(doc => {
      if(!doc)
        throw new NotFoundException();

      if(doc.creatorId == userId){
        // assign Owner role
        request.user.role = Roles.Owner;
      }  
      return true;
    }).catch(err => {
      throw err || new UnauthorizedException();
    });
  }
}
