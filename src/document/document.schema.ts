import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
// import { PatientApplication } from "src/patient/patient-application.schema";

@Schema({timestamps: true})
export class Document {
    @Prop({_id: true, auto: true})
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({required: true})
    title: string;

    @Prop({required: false})
    description: string;

    @Prop()
    files: string[];

    @Prop({required: true})
    creatorId: string;

    // @Prop({type: mongoose.Schema.Types.ObjectId, ref: PatientApplication.name})
    // application: PatientApplication;
    
}
export const documentSchema = SchemaFactory.createForClass(Document);