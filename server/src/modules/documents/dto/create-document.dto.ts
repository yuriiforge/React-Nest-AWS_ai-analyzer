import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  s3Key!: string;
}
