import { Module } from "@nestjs/common";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";

@Module({
  imports: [],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}