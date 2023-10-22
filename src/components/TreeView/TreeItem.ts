export default interface TreeItem {
    id?: string;
    name: string;
    type: string;    
    toggled?: boolean;
    children: TreeItem[];
}