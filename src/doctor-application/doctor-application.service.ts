import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { DoctorAppIdentifiers } from "src/common/types";
import { Document } from "src/document/document.schema";
import { DoctorApplication } from "./doctor-application.schema";
import { CreateDoctorApplicationDto } from "./dto/create-doctor-app.dto";

@Injectable()
export class DoctorApplicationService {

    constructor(@InjectModel(DoctorApplication.name) private doctorAppModel: Model<DoctorApplication>){}

    findOne(identifiers: DoctorAppIdentifiers){
        return this.doctorAppModel.findOne(identifiers).populate(["documents"]);
    }

    create(userId: string, appDto: CreateDoctorApplicationDto){
        return this.doctorAppModel.findOneAndUpdate({ userId }, { $set: {
            userId, specialtyId: appDto.specialtyId
        } },{upsert: true, new: true});
    }

    delete(identifiers: DoctorAppIdentifiers){
        return this.doctorAppModel.findOneAndDelete(identifiers,{new: true});
    }

    accept(identifiers: DoctorAppIdentifiers){
        return this.doctorAppModel.findOneAndUpdate(identifiers, {$set: {isAccepted: true}},{new: true});
    }

    addDocument(identifiers: DoctorAppIdentifiers, document: Document){
        return this.doctorAppModel.findOneAndUpdate(identifiers, {$push:{documents: document}},{new: true});
    }

    addDegree(identifiers: DoctorAppIdentifiers, degree: string){
        return this.doctorAppModel.findOneAndUpdate(identifiers, {$set: {degree}}, {new: true});
    }
}