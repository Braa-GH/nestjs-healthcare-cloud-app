import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin, Repository } from "typeorm";

@Injectable()
export class AdminService {
    constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>){}

    findAll(){
        return this.adminRepo.find({loadRelationIds: true});
    }
}