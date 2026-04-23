import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FeedbackFormsController } from './feedback-forms.controller';
import { FeedbackFormsService } from './feedback-forms.service';

@Module({
  imports: [AuthModule],
  controllers: [FeedbackFormsController],
  providers: [FeedbackFormsService],
  exports: [FeedbackFormsService]
})
export class FeedbackFormsModule {}
