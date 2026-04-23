import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FeedbackResponsesController } from './feedback-responses.controller';
import { FeedbackResponsesService } from './feedback-responses.service';

@Module({
  imports: [AuthModule],
  controllers: [FeedbackResponsesController],
  providers: [FeedbackResponsesService],
  exports: [FeedbackResponsesService]
})
export class FeedbackResponsesModule {}
