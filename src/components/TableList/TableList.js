import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { Theme, Typography, Paper, Divider } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import confirmation from "../../components/ConfirmationDialog";
import Checkbox from './Checkbox';
import Toolbar from './Toolbar';
import { connect } from 'react-redux';
import { openAlertDialog } from "../../reducer/alertDialog";
import { objectEquals } from '../../utils/util';
import WarningIcon from '@mui/icons-material/Warning';
import { Trans, withTranslate } from '../Translate';

/**
 * 
 * @param {Theme} theme 
 * @returns {{[key:string]:React.CSSProperties}}
 */
function style(theme) {
    return {
        root: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: theme.spacing(2),
            //height: '98%',
            overflow: 'hidden'
        },
        noPadding: {
            padding: 0
        },
        headerContent: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 32
        },
        titleContent: { display: 'flex', flex: 1 },
        selectedContent: { display: 'flex', justifyContent: 'center' },
        toolbarContent: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', alignContent: 'center' },
        tableContent: {
            display: 'flex',
            flex: 1,
            overflow: 'auto',
            flexDirection: 'column'
        },
        footerContent: {
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(0, 0, 0, 0.3)'
        },
        table: {
            borderCollapse: 'unset',
            border: '1px solid black',
            borderBottom: 0
        },
        cell: {
            borderWidth: '0 1px 1px 0',
            '&:last-child': {
                borderRight: 0
            }
        },
        headerRow: {

        },
        checkBoxHeaderCell: {
            textAlign: 'center',
            cursor: 'pointer'
            // paddingRight: theme.spacing(3)
        },
        headerCell: {
            textAlign: 'center',
            color: '#031527',
            fontSize: 14,
            fontWeight: 'bold',
            // paddingRight: theme.spacing(3),
            //height: theme.spacing(8),
            /*'& button': {
                marginLeft: -3,
                marginRight: -3,
                padding: 3
            }*/
        },
        bodyRow: {
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.10)'
            }
        },
        selectedRow: {
            '& td': {
                fontWeight: 600
            }
        },
        pointerRow: {
            cursor: 'pointer',
        },
        divider: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        checkBoxBodyCell: {
            textAlign: 'center',
            cursor: 'pointer'
            // paddingRight: theme.spacing(3)
        },
        bodyCell: {
            // paddingRight: theme.spacing(3),
            //height: theme.spacing(8),
            fontSize: 12,
            '& button': {
                marginLeft: -3,
                marginRight: -3,
                padding: 3
            },
            '& p': {
                margin: 0
            }
        }
    }
}

class TableList extends React.Component {
    constructor(props) {
        super(props);
        if (props.columns[0].field !== 'id' && props.columns[0].field !== 'guid') {
            throw new Error("The first column must be a 'id' or 'guid' field!");
        }
        this.state = {
            selectedRows: [],
        }
        this.isChecked = this.isChecked.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangeAllRows = this.handleChangeAllRows.bind(this);
        this.handleChangeSelectRow = this.handleChangeSelectRow.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
    }

    setStateAsync(state) {
        return new Promise((resolve) => this.setState(state, resolve));
    }

    getIdField() {
        const { columns } = this.props;
        return columns[0]['field'];
    }

    handleChangePage(event, page) {
        const { onPageChange } = this.props;
        if (typeof onPageChange === 'function') {
            onPageChange(page);
            this.setState({ selectedRows: [] });
        }
    }

    handleChangeRowsPerPage(event) {
        const { onRowsPerPageChange } = this.props;
        if (event.target !== null) {
            const rowsPerPage = event.target.value;
            if (typeof onRowsPerPageChange === 'function') {
                onRowsPerPageChange(rowsPerPage);
                this.setState({ selectedRows: [] });
            }
        }
    }

    onEditClick() {
        const { onRowEdit } = this.props;
        const { selectedRows } = this.state;
        if (typeof onRowEdit === 'function') {
            const row = this.getRow(selectedRows[0]);
            onRowEdit(row);
            this.setState({ selectedRows: [] });
        }
    }

    getSelectedRows() {
        const { rows } = this.props;
        const { selectedRows } = this.state;
        const idField = this.getIdField();
        return rows.filter(r => selectedRows.includes(r[idField]));
    }

    async onDeleteClick() {
        const { openAlertDialog, onRowsDelete, deleteValidation, deleteConfirmationMessage, t } = this.props;
        const selectedRows = this.getSelectedRows();
        var text = null;
        if (typeof deleteValidation === 'function') {
            const resultValidation = await Promise.resolve(deleteValidation(selectedRows));
            if (resultValidation !== null && typeof resultValidation === 'object') {
                if ('error' in resultValidation) {
                    openAlertDialog(resultValidation['error']);
                    return;
                }
                if ('warning' in resultValidation) {
                    text = resultValidation['warning'];
                }
            }
        }
        if (typeof onRowsDelete === 'function') {
            try {
                await confirmation(text, {
                    title: deleteConfirmationMessage || t('deleteConfirmation', { capitalize: true, namespace: 'tableList' }),
                    okLabel: t('yes'),
                    cancelLabel: t('no')
                });
                onRowsDelete(selectedRows);
                this.setState({ selectedRows: [] });
            }
            catch (e) {

            }
        }
    }

    isChecked(value) {
        const { selectedRows } = this.state;
        const idField = this.getIdField();
        return selectedRows.includes(value);
    }

    handleChangeAllRows(checked) {
        const { rows } = this.props;
        if (checked) {
            const idField = this.getIdField();
            this.setState({ selectedRows: rows.map(r => r[idField]) });
        } else {
            this.setState({ selectedRows: [] });
        }
    }

    handleChangeSelectRow(value, checked) {
        const { selectedRows } = this.state;
        const idField = this.getIdField();
        var newSelectedRows = [];
        const rowId = value;
        if (checked) {
            newSelectedRows = [...selectedRows, rowId];
        } else {
            newSelectedRows = selectedRows.filter(s => s !== rowId);
        }
        this.setState({ selectedRows: newSelectedRows });
    }

    handleRowClick(row) {
        const { onRowClick } = this.props;
        if (typeof onRowClick === 'function') {
            onRowClick(row);
        } else {
            const idField = this.getIdField();
            const value = row[idField];
            this.handleChangeSelectRow(value, !this.isChecked(value));
        }
    }

    getRow(id) {
        const { rows } = this.props;
        const idField = this.getIdField();
        return rows.find(r => r[idField] === id)
    }

    isFirstRow(rowId) {
        const { rows } = this.props;
        const idField = this.getIdField();
        const [first] = rows;
        if (first) {
            return first[idField] === rowId;
        }
        return false;
    }

    isLastRow(rowId) {
        const { rows } = this.props;
        const idField = this.getIdField();
        if (Array.isArray(rows)) {
            var index = rows.findIndex((r) => r[idField] === rowId);
            return index === rows.length - 1;
        }
        return false;
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!objectEquals(prevProps.rows, this.props.rows)) {
            await this.setStateAsync({ selectedRows: [] });
        }
    }

    render() {
        const { classes, title, emptyRowsLabel, rows, columns, page, totalCount, selectableRow, onSearch, onReorder, onExportClick, onFilterClick,
            onSettingClick, onAddClick, onRowEdit, onRowClick, onRowsDelete, rowsPerPageOptions, rowsPerPage, onPageChange, onRowsPerPageChange, noPadding,
            addLabel, editLabel, deleteLabel, onRefreshClick, deleteIcon, t, noStickyHeader, onCustomButtonClick, customButtonLabel, customButtonIcon, selectedFilters, 
            removeFilter, searchText, getColumnTitle
        } = this.props;
        const { selectedRows } = this.state;
        const [selectedRowId] = selectedRows;
        const rowPerPageOptions = typeof onRowsPerPageChange === 'function' ? (rowsPerPageOptions || [10, 25, 50]) : [rows.length];
        const idField = this.getIdField();

        return (
            <Paper
                className={[classes.root, noPadding ? classes.noPadding : undefined].join(' ')}
                square
                elevation={0}
            >
                {title ?
                    <>
                        <div className={classes.headerContent}>
                            {title && <div className={classes.titleContent}><Typography variant='h6'>{title}</Typography></div>}
                            {selectableRow && <div className={classes.selectedContent}>
                                {selectedRows.length > 0 ?
                                    <Typography variant='caption'><Trans translateKey="selectedLineElement" capitalize valuesToReplace={{ element: selectedRows.length }} /></Typography>
                                    : null}
                            </div>}
                            <div className={classes.toolbarContent}>
                                <Toolbar
                                    disableReorderUp={selectedRowId ? this.isFirstRow(selectedRowId) : true}
                                    disableReorderDown={selectedRowId ? this.isLastRow(selectedRowId) : true}
                                    selectedRows={selectedRows.length}
                                    onSearch={onSearch}
                                    onReorder={typeof onReorder === 'function' ? (direction) => {
                                        const [rowId] = selectedRows;
                                        const row = this.getRow(rowId);
                                        onReorder(row, direction);
                                    } : undefined}
                                    onFilterClick={onFilterClick}
                                    onSettingClick={onSettingClick}
                                    onAddClick={onAddClick}
                                    onRefreshClick={typeof onRefreshClick === 'function' ? onRefreshClick : undefined}
                                    onExportClick={typeof onExportClick === 'function' ? onExportClick : undefined}
                                    onEditClick={typeof onRowEdit === 'function' ? this.onEditClick : undefined}
                                    onDeleteClick={typeof onRowsDelete === 'function' ? this.onDeleteClick : undefined}
                                    deleteIcon={deleteIcon}
                                    addLabel={addLabel} editLabel={editLabel} deleteLabel={deleteLabel}
                                    onCustomButtonClick={onCustomButtonClick} customButtonLabel={customButtonLabel} customButtonIcon={customButtonIcon}
                                    selectedFilters={selectedFilters}
                                    removeFilter={removeFilter}
                                    searchText={searchText}
                                />
                            </div>
                        </div>
                        <Divider className={classes.divider} />
                    </>
                    : null}

                <div className={classes.tableContent}>
                    <Table stickyHeader={!noStickyHeader} className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {columns.map(({ field, value, visible, width, colSpan }, i) => {
                                    const isAllSelected = rows.length > 0 && selectedRows.length === rows.length;
                                    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < rows.length;
                                    return (
                                        selectableRow === true && field === idField ?
                                            <TableCell
                                                className={[classes.checkBoxHeaderCell, classes.cell].join(' ')}
                                                style={{ width }}
                                                key={`cell_${i}`}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    this.handleChangeAllRows(!isAllSelected);
                                                }}
                                            >
                                                <Checkbox
                                                    disabled={rows.length === 0}
                                                    indeterminate={isIndeterminate}
                                                    checked={isAllSelected}
                                                    onChange={(event, checked) => this.handleChangeAllRows(checked)}
                                                    color='primary'
                                                    size='small'
                                                />
                                            </TableCell> :
                                            visible === false ?
                                                null :
                                                <TableCell colSpan={colSpan} className={[classes.headerCell, classes.cell].join(' ')} style={{ width }} key={`cell_${i}`}>
                                                    {(value || field)}
                                                </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.length > 0 ? rows.map(row => {
                                const isChecked = this.isChecked(row[idField]);
                                return (
                                    <TableRow
                                        className={(selectableRow || typeof onRowClick === 'function') ? [classes.bodyRow, classes.pointerRow, (isChecked ? classes.selectedRow : '')].join(' ') : classes.bodyRow}
                                        key={'row_' + row[idField]}
                                        onClick={(event) => {
                                            if ((selectableRow || typeof onRowClick === 'function') && event.target.tagName === "TD") {
                                                this.handleRowClick(row);
                                            }
                                        }}
                                    >
                                        {columns.map(({ field, visible, alignContent, verticalAlign }, i) => {
                                            if (selectableRow === true && field === idField) {
                                                return (
                                                    <TableCell
                                                        className={[classes.checkBoxBodyCell, classes.cell].join(' ')}
                                                        key={`cell_${i}`}
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            this.handleChangeSelectRow(row[field], !isChecked);
                                                        }}
                                                    >
                                                        <Checkbox
                                                            value={String(row[field])}
                                                            checked={isChecked}
                                                            onChange={(event, checked) => this.handleChangeSelectRow(row[field], checked)}
                                                            color='primary'
                                                            size='small'
                                                        />
                                                    </TableCell>
                                                );
                                            }
                                            const columnTitle = getColumnTitle ? getColumnTitle(row, field) : '';
                                            return (visible === false ? null : <TableCell title={columnTitle} key={`cell_${i}`} className={[classes.bodyCell, classes.cell].join(' ')} style={{ textAlign: alignContent, verticalAlign: verticalAlign }}>{row[field]}</TableCell>);
                                        })}
                                    </TableRow>
                                )
                            }) : (
                                <TableRow className={classes.bodyRow} key={'row'}>
                                    <TableCell className={[classes.bodyCell, classes.cell].join(' ')} colSpan={columns.length}>
                                        <Typography variant='subtitle2' align='center'>
                                            {emptyRowsLabel ? emptyRowsLabel : <Trans translateKey="noRecordsFound" capitalize />}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {typeof onPageChange === 'function' &&
                    <div className={classes.footerContent}>
                        <TablePagination
                            rowsPerPageOptions={rowPerPageOptions}
                            component="div"
                            count={totalCount || rows.length}
                            rowsPerPage={rowsPerPage || rowPerPageOptions[0]}
                            page={page || 0}
                            labelRowsPerPage={<Trans translateKey="linesPerPage" capitalize />}
                            labelDisplayedRows={(obj) => <Trans translateKey="fromToOfCount" capitalize valuesToReplace={obj} />}
                            backIconButtonProps={{ size: 'small', title: t('previous', { capitalize: true }) }}
                            nextIconButtonProps={{ size: 'small', title: t('next', { capitalize: true }) }}
                            onRowsPerPageChange={this.handleChangeRowsPerPage}
                            onPageChange={this.handleChangePage}
                        />
                    </div>
                }
            </Paper>
        );
    }
}

export default connect(null, { openAlertDialog })(withTranslate()(withStyles(style)(TableList)));