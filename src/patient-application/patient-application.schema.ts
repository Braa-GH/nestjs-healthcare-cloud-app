import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "src/document/document.schema";

@Schema({collection: "patient-application", timestamps: true})
export class PatientApplication {
    @Prop({_id: true, auto: true})
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({required: true, unique: true})
    userId: string;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: "Document"}]})
    documents: Document[];

    @Prop({default: false})
    isAccepted: boolean;

}
export const PatientApplicationSchema = SchemaFactory.createForClass(PatientApplication);