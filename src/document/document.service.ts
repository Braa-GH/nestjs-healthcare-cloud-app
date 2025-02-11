import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Document } from "./document.schema";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Injectable()
export class DocumentService {
    constructor(@InjectModel(Document.name) private documentModel: Model<Document>){}

    async create(documentDto: CreateDocumentDto, creatorId: string){
        const document = await this.documentModel.create({...documentDto, creatorId});
        return await document.save();
    }

    findAll(){
        return this.documentModel.find();
    }

    findOne(documentId: string){
        return this.documentModel.findById(documentId);
    }

    update(documentId: string, documentDto: UpdateDocumentDto){
        return this.documentModel.findByIdAndUpdate(documentId, documentDto, {new: true});
    }

    delete(documentId: string){
        return this.documentModel.findByIdAndDelete(documentId);
    }

}