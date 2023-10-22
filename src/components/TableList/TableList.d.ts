import React, { RefObject } from 'react';

interface ColumnItem<T extends object> {
    field: keyof T;
    value?: React.ReactNode;
    visible?: boolean;
    width?: number | string;
    colSpan?: number;
    alignContent?: 'left' | 'center' | 'right';
    verticalAlign?: string;
}

export interface ValidationResult {
    error?: string;
    warning?: string;
}

export interface SelectedFilter {
    label: string;
    key: number;
}

interface TableListProps<T extends Object> {
    title?: React.ReactNode;
    emptyRowsLabel?: string;
    rows: T[];
    columns: ColumnItem<T>[];

    page?: number;
    totalCount?: number;
    rowsPerPageOptions?: number[];
    rowsPerPage?: number;

    addLabel?: string;
    editLabel?: string;
    deleteLabel?: string;
    deleteConfirmationMessage?: string;
    deleteIcon?: any;

    onCustomButtonClick?: () => void;
    customButtonLabel?: string;
    customButtonIcon?: any;

    onRefreshClick?: () => void;
    onExportClick?: () => void;
    onFilterClick?: () => void;
    onSettingClick?: () => void;
    onAddClick?: () => void;
    onRowEdit?: (row: T) => void;
    onRowsDelete?: (rows: T[]) => void;
    onSearch?: (value: string) => void;
    onReorder?: (row: T, direction: number) => void;
    onPageChange?: (page: number) => void;
    onRowsPerPageChange?: (rowsPerPage: number) => void;
    onRowClick?: (row: T) => void;
    deleteValidation?: (rows: T[]) => Promise<ValidationResult | null>
    getColumnTitle?: (row: T, field: keyof T) => string;

    selectableRow?: boolean;

    noPadding?: boolean;

    noStickyHeader?: boolean;

    selectedFilters?: SelectedFilter[];
    removeFilter?: (key: number) => void;

    searchText?: string;
}

class TableList<T> extends React.Component<TableListProps<T>>{ }

export default TableList;