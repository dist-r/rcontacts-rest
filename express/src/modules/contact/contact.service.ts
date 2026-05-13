import IContactRepository from "./contact.repository";

export default class ContactService {

  constructor(private contactRepository: IContactRepository) {}
  
}