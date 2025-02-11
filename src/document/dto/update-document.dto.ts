import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';


export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
    @IsOptional() @IsArray() @IsString({each: true})
    files: string[];
}
