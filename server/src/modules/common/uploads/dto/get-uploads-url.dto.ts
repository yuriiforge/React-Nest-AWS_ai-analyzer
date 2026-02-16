import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Max,
} from 'class-validator';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export class GetUploadUrlDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\.(pdf)$/i, { message: 'Only .pdf files allowed' })
  fileName!: string;

  @IsNumber()
  @Max(MAX_FILE_SIZE, { message: 'File size must be less than 10MB' })
  fileSize!: number;
}
