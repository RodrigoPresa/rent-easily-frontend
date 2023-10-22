export default interface OptionItem<T> {
    label: string;
    value: T;
    disabled?: boolean;
}