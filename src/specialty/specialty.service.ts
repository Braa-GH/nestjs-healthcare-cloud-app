import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Specialty } from './specialty.entity';
import { Repository } from 'typeorm';
import { SpecialtyIdentifiers } from 'src/common/types';
import { randomBytes } from 'crypto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtyService {
    constructor(@InjectRepository(Specialty) private specialtyRepo: Repository<Specialty>){}

    findOne({id, name}: SpecialtyIdentifiers){
        return this.specialtyRepo.findOne({
            where: [{id}, {name}]
        });
    }
    
    async create(name: string){
        const id = `spec-${randomBytes(2).toString("hex")}`;
        const idExist = await this.findOne({id});
        if(idExist)
            return await this.create(name);
        const specialty = this.specialtyRepo.create({id, name});
        return await this.specialtyRepo.save(specialty);
    }

    findAll(){
        return this.specialtyRepo.find();
    }

    update(specialtyId: string, dto: UpdateSpecialtyDto){
        return this.specialtyRepo.update({id: specialtyId}, {name: dto.newName});
    }

    delete(specialtyId: string){
        return this.specialtyRepo.delete({id: specialtyId});
    }
}
