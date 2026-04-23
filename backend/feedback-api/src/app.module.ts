import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { FeedbackFormsModule } from './modules/feedback-forms/feedback-forms.module';
import { FeedbackResponsesModule } from './modules/feedback-responses/feedback-responses.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FeedbackFormsModule,
    FeedbackResponsesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
