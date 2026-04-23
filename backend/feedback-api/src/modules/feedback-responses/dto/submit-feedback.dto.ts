import { IsArray, IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

class SubmitAnswerDto {
  @IsString()
  questionId!: string;

  @IsOptional()
  value!: string | string[] | number;
}

export class SubmitFeedbackDto {
  @IsString()
  formId!: string;

  @IsBoolean()
  anonymous!: boolean;

  @IsArray()
  answers!: SubmitAnswerDto[];
}

export class ResponseSummaryDto {
  @IsIn(['mock'])
  mode!: 'mock';
}
