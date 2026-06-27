import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [UserModule, ContactModule],
})
export class AppModule {}
