import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatientService {
    constructor(@InjectRepository(Patient) private patientRepo: Repository<Patient>){}

    orderRegister(){
        
    }
}
