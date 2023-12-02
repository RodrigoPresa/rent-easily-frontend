import DateTimeDTO from "./DateTimeDTO";

export default interface ProposalDTO {
    proposedAt: DateTimeDTO;
    advertisementId: number;
    userId: number;
    amount: number;
    information: string;
}