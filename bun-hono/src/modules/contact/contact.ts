type Contact = {
  id: number | string
  userId: string
  name: string
  email: string
  phone: string
}

export interface CreateContact {
  name: string
  email: string
  phone: string
  userId: string
}


export default Contact;