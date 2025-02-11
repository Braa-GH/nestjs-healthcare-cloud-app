import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { PatientIdentifiers } from 'src/common/types';
import { User } from 'src/user/user.entity';

@Injectable()
export class PatientService {
    constructor(@InjectRepository(Patient) private patientRepo: Repository<Patient>){}

    async create(userId: string){
        const date = `${new Date().getUTCMonth()+1}${new Date().getUTCFullYear()}`;
        const patientId = `pt-${date.length == 5 ? "0":""}${date}-${randomBytes(3).toString("hex")}`;
        const patient = this.patientRepo.create({id: patientId, user: userId});
        const saved = await this.patientRepo.save(patient);
        return saved;
    }

    findOne({id, userId}: PatientIdentifiers){
        const user = new User();
        user.id = userId as any;
        return this.patientRepo.findOne({
            where: [{id},{user}],
            // relations: ["user"]
            loadRelationIds: true
        });
    }

    findAll(limit: number = 100, page: number = 1){
        const skip = (limit * page) - limit;
        return this.patientRepo.find({
            // relations: ["user"],
            loadRelationIds: true,
            take: limit,
            skip
        })
    }

    delete(patientId: string){
        return this.patientRepo.delete({id: patientId});
    }
}
