import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomBytes } from "crypto";
import { Repository } from "typeorm";
import { Admin } from "./admin.entity";
import { AdminIdentifiers } from "src/common/types";
import { User } from "src/user/user.entity";

@Injectable()
export class AdminService {
    constructor(@InjectRepository(Admin) private adminRepo: Repository<Admin>){}

    findAll(){
        return this.adminRepo.find({loadRelationIds: true});
    }

    findOne({id, userId}: AdminIdentifiers){
        const user = new User();
        user.id = userId;
        return this.adminRepo.findOne({
            where: [{id}, {user}],
            loadRelationIds: true
        });
    }

    async create(userId: string){
        //generate adminId
        const date = `${new Date().getUTCMonth()+1}${new Date().getUTCFullYear()}`;
        const adminId = `ad-${date.length == 5 ? "0":""}${date}-${randomBytes(3).toString("hex")}`;
        //if generated Id is already exist in db, try again..
        const idExist = await this.findOne({id: adminId});
        if(idExist)
            return await this.create(userId);
        const admin = this.adminRepo.create({id: adminId, user: userId});
        const saved = await this.adminRepo.save(admin);
        return saved;
    }

    delete(adminId: string){
        return this.adminRepo.delete({id: adminId});
    }
}