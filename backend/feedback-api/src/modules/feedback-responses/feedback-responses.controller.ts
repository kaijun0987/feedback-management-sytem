import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { AuthService } from '../auth/auth.service';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto';
import { FeedbackResponsesService } from './feedback-responses.service';

@Controller()
export class FeedbackResponsesController {
  constructor(
    private readonly feedbackResponsesService: FeedbackResponsesService,
    private readonly authService: AuthService
  ) {}

  @Post('feedback/forms/:formId/submit')
  async submitFeedback(
    @Param('formId') formId: string,
    @Body() payload: SubmitFeedbackDto,
    @Headers('authorization') authorization?: string
  ) {
    const user = await this.authService.getUserFromAuthorization(authorization);

    if (!user?.userId) {
      throw new BadRequestException('Login required to submit feedback');
    }

    if (payload.formId && payload.formId !== formId) {
      throw new BadRequestException('Form id mismatch');
    }

    return this.feedbackResponsesService.submitFeedback(
      {
        ...payload,
        formId
      },
      user.userId
    );
  }

  @Get('feedback/forms/:formId/my-submission')
  async getMySubmission(@Param('formId') formId: string, @Headers('authorization') authorization?: string) {
    const user = await this.authService.getUserFromAuthorization(authorization);

    if (!user?.userId) {
      throw new UnauthorizedException();
    }

    return this.feedbackResponsesService.getMySubmission(formId, user.userId);
  }

  @Get('admin/feedback/forms/:formId/responses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R_ADMIN', 'R_SUPER')
  async getResponses(@Param('formId') formId: string) {
    return this.feedbackResponsesService.getResponses(formId);
  }

  @Get('admin/feedback/forms/:formId/responses/summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R_ADMIN', 'R_SUPER')
  async getSummary(@Param('formId') formId: string) {
    return this.feedbackResponsesService.getSummary(formId);
  }
}
