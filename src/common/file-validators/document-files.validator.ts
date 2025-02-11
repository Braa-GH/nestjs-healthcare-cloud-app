import { FileValidator, UnprocessableEntityException } from "@nestjs/common";
import { IFile } from "@nestjs/common/pipes/file/interfaces";
import { unlinkSync } from "fs";

export class DocumentFileValidator extends FileValidator{
    isValid(file?: IFile | IFile[] | Record<string, IFile[]>): boolean | Promise<boolean> {
        const { path, size } = file as any;
        if(size > 900000){
            try{
                unlinkSync(path);
            }catch(err){}
            throw new UnprocessableEntityException("900kb max size limited!");
        }
        return true;
    }
    buildErrorMessage(file: any): string {
        return "invalid file for profile document!";
    }
    
}