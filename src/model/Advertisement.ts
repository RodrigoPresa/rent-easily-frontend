export default interface Advertisement {
    id: number;
    active: boolean;
    rentAmount: number;
    information: string;
    postedAt: Date;
    propertyId: number;
}