import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSpecialtyDto {
  @IsString()
  @ApiProperty({example: "Ophthalmologist"})
  newName: string;
}
