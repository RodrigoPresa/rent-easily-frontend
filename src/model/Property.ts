import PropertyAddress from "./PropertyAddress";

export default interface Property {
    id: number;
    description: string;
    userId: number;
    active: boolean;
    registryId: string;
    address: PropertyAddress;
}