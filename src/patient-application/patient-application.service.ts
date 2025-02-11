import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PatientApplication } from '../patient-application/patient-application.schema';
import { Model } from 'mongoose';
import { PatientAppIdentifiers } from "src/common/types";
import { Document } from "src/document/document.schema";
import { ApplicationStatus } from "src/common/enums";

@Injectable()
export class PatientApplicationService {

    constructor(@InjectModel(PatientApplication.name) private patientAppModel: Model<PatientApplication>){}

    findOne(identifiers: PatientAppIdentifiers){
        return this.patientAppModel.findOne(identifiers).populate(["documents"]);
    }

    create(userId: string){
        return this.patientAppModel.findOneAndUpdate({ userId }, { userId },{upsert: true, new: true});
    }

    delete(identifiers: PatientAppIdentifiers){
        return this.patientAppModel.findOneAndDelete(identifiers,{new: true});
    }

    accept(identifiers: PatientAppIdentifiers){
        return this.patientAppModel.findOneAndUpdate(identifiers, {$set: {
            status: ApplicationStatus.Accepted
        }},{new: true});
    }

    reject(identifiers: PatientAppIdentifiers){
        return this.patientAppModel.findOneAndUpdate(identifiers, {
            $set: {status: ApplicationStatus.Rejected}
        },{new: true});
    }

    addDocument(identifiers: PatientAppIdentifiers, document: Document){
        return this.patientAppModel.findOneAndUpdate(identifiers, {$push:{documents: document}},{new: true});
    }
}