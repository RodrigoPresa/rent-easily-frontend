export default interface Proposal {
    id: number;
    dateTime: Date;
    advertisementId: number;
    userId: number;
    amount: number;
    information: string;
}