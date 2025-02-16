import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { DoctorIdentifiers } from 'src/common/types';
import { User } from 'src/user/user.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { SpecialtyService } from 'src/specialty/specialty.service';
import { Specialty } from 'src/specialty/specialty.entity';

@Injectable()
export class DoctorService {
    constructor(
        @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
        private specialtyService: SpecialtyService
    ){}

    findOne({id, userId}: DoctorIdentifiers){
        const user = new User();
        user.id = userId as string;
        return this.doctorRepo.findOne({
            where: [{id, user}],
            loadRelationIds: true
        })
    }

    findAll(limit: number = 100, page: number = 1){
        const skip = (limit * page) - limit;
        return this.doctorRepo.find({
            loadRelationIds: true,
            take: limit,
            skip,
        });
    }

    async create(userID: string, doctorDto: CreateDoctorDto){
        // generate ID
        const date = `${new Date().getUTCMonth()+1}${new Date().getUTCFullYear()}`;
        const doctorId = `dr-${date.length == 5 ? "0":""}${date}-${randomBytes(3).toString("hex")}`;
        //if generated Id is already exist in db, try again..
        const idExist = await this.findOne({id: doctorId});
        if(idExist){
            return await this.create(userID, doctorDto);
        }
        const specialty = await this.specialtyService.findOne({id: doctorDto.specialtyId}) as Specialty;
        const doctor = this.doctorRepo.create({
            id: doctorId, user: userID, ...doctorDto, specialty
        });
        return await this.doctorRepo.upsert(doctor, {conflictPaths: {user: true}});
    }

    update(doctorId: string, {specialtyId}: UpdateDoctorDto){
        return this.doctorRepo.update({id: doctorId}, {specialty: specialtyId});
    }

    delete(doctorId: string){
        return this.doctorRepo.delete({id: doctorId});
    }
}
