import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import type { AuthUser } from '../../common/auth/auth-user';
import { FormListQueryDto } from './dto/form-list-query.dto';
import { SaveFeedbackFormDto } from './dto/save-feedback-form.dto';
import { ToggleFeedbackFormStatusDto } from './dto/toggle-feedback-form-status.dto';
import { FeedbackFormsService } from './feedback-forms.service';

@Controller()
export class FeedbackFormsController {
  constructor(private readonly feedbackFormsService: FeedbackFormsService) {}

  @Get('feedback/forms')
  async getPublicForms(@Query() query: FormListQueryDto) {
    return this.feedbackFormsService.listPublicForms(query);
  }

  @Get('feedback/forms/:formId')
  async getPublicFormDetail(@Param('formId') formId: string) {
    return this.feedbackFormsService.getPublicFormDetail(formId);
  }

  @Get('admin/feedback/forms/:formId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R_ADMIN', 'R_SUPER')
  async getAdminFormDetail(@Param('formId') formId: string) {
    return this.feedbackFormsService.getAdminFormDetail(formId);
  }

  @Get('admin/feedback/forms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R_ADMIN', 'R_SUPER')
  async getAdminForms(@Query() query: FormListQueryDto) {
    return this.feedbackFormsService.listAdminForms(query);
  }

  @Post('admin/feedback/forms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R_ADMIN', 'R_SUPER')
  async createForm(@Body() payload: SaveFeedbackFormDto, @CurrentUser() user: AuthUser) {
    return this.feedbackFormsService.saveForm(payload, user.userId);
  }

  @Put('admin/feedback/forms/:formId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R_ADMIN', 'R_SUPER')
  async updateForm(
    @Param('formId') formId: string,
    @Body() payload: SaveFeedbackFormDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.feedbackFormsService.saveForm(
      {
        ...payload,
        id: formId
      },
      user.userId
    );
  }

  @Patch('admin/feedback/forms/:formId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('R_ADMIN', 'R_SUPER')
  async toggleStatus(@Param('formId') formId: string, @Body() payload: ToggleFeedbackFormStatusDto) {
    return this.feedbackFormsService.toggleStatus(formId, payload.status);
  }
}
