import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { AppointmentStatus } from "src/common/enums";

@Schema({timestamps: true})
export class Appointment {
    @Prop({_id: true, auto: true})
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({required: true})
    patientId: string;

    @Prop({required: true})
    doctorId: string;

    @Prop({default: AppointmentStatus.Waiting})
    status: string

    @Prop({type: mongoose.Schema.Types.Date, required: true})
    startTime: Date;

    @Prop({type: mongoose.Schema.Types.Date, required: true})
    endTime: Date;

    @Prop({default: false})
    isFollowup: boolean;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: Appointment.name}]})
    followups: Appointment[];
}
export const appointmentSchema = SchemaFactory.createForClass(Appointment);