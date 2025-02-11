import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid } from "uuid";
import { UserIdentifiers } from 'src/common/types';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcrypt";
import { ValidateUserIdPipe } from './pipes/validate-user-id.pipe';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>){}

    findOne(userIdentifiers: UserIdentifiers){
        return this.userRepo.findOne({
            where: userIdentifiers
        });
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
        const isValid = new ValidateUserIdPipe().isValid(id);
        if(!isValid)
            return await this.create(userDto);

        const idExist = await this.findOne({id});
        if(idExist){
            //if generated Id is already exist in db, try again..
            return await this.create(userDto);
        }
        const user = this.userRepo.create({ ...userDto, id });
        const row = await this.userRepo.save(user);
        delete row.password;
        return row;
    }

    update(userId: string, userDto: UpdateUserDto | any){
        return this.userRepo.update({id: userId}, userDto);
    }

    delete(userId: string){
        return this.userRepo.delete({id: userId});
    }

    async validatePassword(userId: string, password: string){
        const user = await this.findOne({id: userId});
        const compare = await bcrypt.compare(password, user.password);
        return compare ? true : false;
    }

    async changePassword(userId: string, oldPass: string, newPass: string){
        const compare = await this.validatePassword(userId, oldPass);
        if(!compare){
            throw new BadRequestException("Invalid Password!");
        }
        const salt = bcrypt.genSaltSync();
        const encryptedPassword = bcrypt.hashSync(newPass, salt);
        return await this.userRepo.update({id: userId}, {password: encryptedPassword});
    }

}
