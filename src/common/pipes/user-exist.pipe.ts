import { ArgumentMetadata, Inject, NotFoundException, PipeTransform } from "@nestjs/common";
import { UserService } from "src/user/user.service"

export class UserExistPipe implements PipeTransform {
    constructor(@Inject() private userService: UserService){}

    async transform(userId: string, metadata: ArgumentMetadata) {
        const user = await this.userService.findOne({id: userId});
        if(!user)
            throw new NotFoundException("user with provided ID is not exist!");
        return userId;
    }

}