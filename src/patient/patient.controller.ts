import { Controller, Param } from '@nestjs/common';
import { PatientService } from './patient.service';

@Controller()
export class PatientController {
    constructor(private patientService: PatientService){}

    orderRegister(){

    }

    findOne(@Param("id") patientId: string){

    }

    findAll(){
        
    }
}
