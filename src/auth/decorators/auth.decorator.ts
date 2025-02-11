import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/enums';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { DefaultGuard } from 'src/common/guards/default.guard';

export function Auth(OwnerGuard,...roles: Roles[]){
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(JwtAuthGuard, OwnerGuard ?? DefaultGuard, RolesGuard)
  )
}
