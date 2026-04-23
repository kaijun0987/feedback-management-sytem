import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

class QuestionOptionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MaxLength(100)
  label!: string;
}

class QuestionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  description!: string;

  @IsIn(['text', 'singleChoice', 'multipleChoice', 'star'])
  type!: 'text' | 'singleChoice' | 'multipleChoice' | 'star';

  @IsBoolean()
  required!: boolean;

  @IsArray()
  options!: QuestionOptionDto[];
}

export class SaveFeedbackFormDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @MaxLength(200)
  title!: string;

  @IsString()
  description!: string;

  @IsIn(['enabled', 'disabled'])
  status!: 'enabled' | 'disabled';

  @IsOptional()
  @IsString()
  startAt!: string | null;

  @IsOptional()
  @IsString()
  endAt!: string | null;

  @IsInt()
  @Min(1)
  estimatedMinutes!: number;

  @IsArray()
  tags!: string[];

  @IsArray()
  questions!: QuestionDto[];
}
