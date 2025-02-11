import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { AppointmentService } from '../appointment.service';

@Injectable()
export class AppointmentExistPipe implements PipeTransform {
  constructor(private appointmentService: AppointmentService){}

  transform(appointmentId: string, metadata: ArgumentMetadata) {
    return this.appointmentService.findOne({_id: appointmentId}).then(result => {
      if(!result)
        throw new BadRequestException("Appointment is not exist!");
      return appointmentId;
    }).catch(err => {
      throw err || new BadRequestException();
    })
  }
}
