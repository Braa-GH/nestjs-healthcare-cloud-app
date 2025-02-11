import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid } from "uuid";
import { UserIdentifiers } from 'src/common/types';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>){}

    async findOne(userIdentifiers: UserIdentifiers){
        const user = await this.userRepo.findOne({
            where: userIdentifiers
        });
        return user;
    }

    async findAll(limit: number = 100, page: number = 1){
        const skip = (page * limit) - limit;
        const result = await this.userRepo.find({
            skip,
            take: limit,
            select: ["id","firstName","lastName","email","phone","dob","sex","profileImg"]
        })
        return result;
    }

    async create(userDto: CreateUserDto){
        const id = uuid();
        const idExist = await this.findOne({id});
        if(idExist){
            //if generated Id is already exist in db, try again..
            return await this.create(userDto);
        }
        const user = this.userRepo.create({ ...userDto, id });
        const row = await this.userRepo.save(user) as any;
        delete row.password;
        return row;
    }

    update(userId: string, userDto: UpdateUserDto){
        return this.userRepo.update({id: userId}, userDto);
    }

    delete(userId: string){
        return this.userRepo.delete({id: userId});
    }

}
