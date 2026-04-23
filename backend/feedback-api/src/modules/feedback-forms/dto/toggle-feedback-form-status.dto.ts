import { IsIn } from 'class-validator';

export class ToggleFeedbackFormStatusDto {
  @IsIn(['enabled', 'disabled'])
  status!: 'enabled' | 'disabled';
}
