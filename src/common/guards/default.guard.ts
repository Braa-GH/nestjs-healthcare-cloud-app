
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
@Injectable()
export class DefaultGuard implements CanActivate {
  canActivate(context: ExecutionContext){
    return true;
  }
}
