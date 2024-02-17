import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsMongoId,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly password: string;

  @IsNotEmpty()
  readonly role: string;

  @IsMongoId()
  readonly customer: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
