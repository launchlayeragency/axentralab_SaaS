import { IsString, IsUrl, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWebsiteDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateWebsiteDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
