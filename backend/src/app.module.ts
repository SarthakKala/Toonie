// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIModule } from './AI/ai.module';
import { HealthController } from './check/health.controller';


@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AIModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}