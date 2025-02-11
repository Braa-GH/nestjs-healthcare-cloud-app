import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { SpecialtyService } from '../specialty.service';

@Injectable()
export class SpecialtyExistPipe implements PipeTransform {
  constructor(private specialtyService: SpecialtyService){}

  async transform(specialtyId: string, metadata: ArgumentMetadata) {
    const specialty = await this.specialtyService.findOne({id: specialtyId});
    if(!specialty)
      throw new NotFoundException("specialty is not exist!");
    return specialtyId;
  }
}
