  import { Module } from "@nestjs/common";
  import { ContactController } from "./contact.controller";
  import { ContactService } from "./contact.service";
  import { CommonModule } from "src/common/common.module";
import PostgresContactRepository from "./contact.repoimp";

  @Module({
    imports: [CommonModule],
    controllers: [ContactController],
    providers: [
      {
        provide: "IContactRepository",
        useClass: PostgresContactRepository
      },
      ContactService
    ],
  })
  export class ContactModule {}