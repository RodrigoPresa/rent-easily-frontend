import DateTimeDTO from "./DateTimeDTO";

export default interface Favorite {
    id: number;
    userId: number;
    advertisementId: number;
    dateTime: DateTimeDTO;
}