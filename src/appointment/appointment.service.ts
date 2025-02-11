import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Appointment } from './appointment.schema';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DateHandlerService } from 'src/common/date-handler/date-handler.service';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FollowupDto } from './dto/followup.dto';
import { Interval, parseJSON } from 'date-fns';
import { AppointmentIdentifiers, AppointmentsIdentifiers } from 'src/common/types';
import { AppointmentStatus } from 'src/common/enums';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
        private dateService: DateHandlerService
    ){}

    async create(appointmentDto: CreateAppointmentDto){
        let { startTime, periodInMinutes } = appointmentDto;
        startTime = parseJSON(startTime);
        const endTime = this.dateService.getEndTime(startTime, periodInMinutes);
        return this.appointmentModel.create({...appointmentDto, startTime, endTime});
    }

    findOne(identifiers: AppointmentIdentifiers){
        return this.appointmentModel.findOne(identifiers);
    }

    findAll({doctorId, patientId, ignoreFollowups}: AppointmentsIdentifiers){
        const patientCondition = patientId ? {patientId} : {};
        const doctorCondition = doctorId ? {doctorId} : {};
        const patientDoctorFilters = {$or:[ patientCondition, doctorCondition]};
        const followupsFilter = ignoreFollowups ? {isFollowup: false}: {};
        const filters = {$and: [patientDoctorFilters, followupsFilter]};  
        return this.appointmentModel.find(filters).populate("followups");
    }

    getDoctorAppointments(doctorId: string){
        return this.findAll({doctorId, ignoreFollowups: true});
    }

    getPatientAppointments(patientId: string){
        return this.findAll({patientId, ignoreFollowups: true});
    }

    async addFollowup(appointmentId: string, followupDto: FollowupDto | any){
        const followup = await this.appointmentModel.create({...followupDto, isFollowup: true});
        return this.appointmentModel.updateOne({_id: appointmentId}, {$push: {followups: followup}}, {new: true});
    }

    update(appointmentId: string, appointmentDto: UpdateAppointmentDto){
        return this.appointmentModel.updateOne({_id: appointmentId}, appointmentDto, {new: true});
    }

    accept(appointmentId: string){
        return this.appointmentModel.updateOne({_id: appointmentId}, {
            $set: {status: AppointmentStatus.Accepted}
        });
    }

    reject(appointmentId: string){
        return this.appointmentModel.updateOne({_id: appointmentId}, {
            $set: {status: AppointmentStatus.Rejected}
        });
    }

    cancel(appointmentId: string){
        return this.appointmentModel.updateOne({_id: appointmentId}, {
            $set: {status: AppointmentStatus.Canceled}
        });
    }

    delete(appointmentId: string){
        return this.appointmentModel.findOneAndDelete({_id: appointmentId});
    }

    isAppointmentsOverlapping(firstInterval: Interval, lastInterval: Interval): boolean {
        return this.dateService.isPeriodsOverlapping(firstInterval,lastInterval);
    }
}
