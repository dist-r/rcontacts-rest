import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { ContactModule } from './modules/contact/contact.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CommonModule } from './common/common.module';
@Module({
  imports: [AuthModule, UserModule, ContactModule, CommonModule],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer ) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  } 
}
