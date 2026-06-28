  import { Module } from "@nestjs/common";
  import { ContactController } from "./contact.controller";
  import { ContactService } from "./contact.service";
  import { CommonModule } from "src/common/common.module";

  @Module({
    imports: [CommonModule],
    controllers: [ContactController],
    providers: [ContactService],
  })
  export class ContactModule {}