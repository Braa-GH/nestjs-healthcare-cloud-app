import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: true, collection: "doctor-application"})
export class DoctorApplication {
    @Prop({_id: true, auto: true})
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({required: true, unique: true})
    userId: string;

    @Prop()
    degree: string

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "Document"}]})
    documents: Document[];

    @Prop({default: false})
    isAccepted: boolean;

    @Prop()
    specialtyId: string;
}

export const DoctorApplicationSchema = SchemaFactory.createForClass(DoctorApplication);