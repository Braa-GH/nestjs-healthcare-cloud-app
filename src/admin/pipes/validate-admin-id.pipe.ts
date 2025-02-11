import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateAdminIdPipe implements PipeTransform {
  transform(adminId: string, metadata: ArgumentMetadata) {
    if(!adminId) throw new BadRequestException("Admin ID Can Not Be Empty!");

    const parts = adminId.split("-");
    if(adminId.length !== 16 ||
       parts.length !== 3 ||
       parts[0] !== "ad" ||
       parts[1].length !== 6 ||
       parts[2].length !== 6
      )
      throw new BadRequestException("Invalid Admin ID!")
    return adminId;
  }
}
