import { RegistrationType } from "../enum/RegistrationType";
import Credentials from "./Credentials";

export default interface User {
    id: number;
    fullName: string;
    cpf: string;
    income: number;
    registerType: RegistrationType;
    credentials: Credentials;
}