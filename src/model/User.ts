import { RegistrationType } from "../enum/RegistrationType";

export default interface User {
    id: number;
    fullName: string;
    cpf: string;
    income: number;
    type: RegistrationType;
}