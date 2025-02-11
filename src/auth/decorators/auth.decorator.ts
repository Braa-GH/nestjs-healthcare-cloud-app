import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/enums';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export function Auth(...roles: Roles[]){
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(JwtAuthGuard, RolesGuard)
  )
}
