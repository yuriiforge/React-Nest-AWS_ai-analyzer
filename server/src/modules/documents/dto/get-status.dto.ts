import { IsNotEmpty, IsString } from 'class-validator';

export class GetStatusDto {
  @IsNotEmpty({ message: 'Email query parameter is required' })
  @IsString()
  email!: string;
}
