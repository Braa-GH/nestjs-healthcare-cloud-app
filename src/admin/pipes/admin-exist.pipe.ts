import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { AdminService } from '../admin.service';

@Injectable()
export class AdminExistPipe implements PipeTransform {
  constructor(private adminService: AdminService){}

  async transform(adminId: any, metadata: ArgumentMetadata) {
    const admin = await this.adminService.findOne({id: adminId});
    if(!admin)
      throw new NotFoundException("Admin is not exist!")
    return adminId;
  }
}
