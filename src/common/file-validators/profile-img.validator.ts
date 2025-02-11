import { FileValidator, UnprocessableEntityException } from "@nestjs/common";
import { IFile } from "@nestjs/common/pipes/file/interfaces";
import { imageMimeTypes } from "../constants";
import { unlinkSync } from "fs";

export class ProfileImgValidator extends FileValidator{
    isValid(file?: IFile | IFile[] | Record<string, IFile[]>): boolean | Promise<boolean> {
        const { mimetype, path, size } = file as any;
        if(!imageMimeTypes.includes(mimetype)){
            unlinkSync(path);
            throw new UnprocessableEntityException("png or jpg image expected!");
        }else if(size > 900000){
            unlinkSync(path);
            throw new UnprocessableEntityException("900kb max size limited!");
        }
        return true;
    }
    buildErrorMessage(file: any): string {
        return "invalid file for profile image!";
    }
    
}