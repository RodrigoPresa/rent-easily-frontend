import React, { useEffect, useState } from 'react';
import { Box, Chip, IconButton, Tooltip } from '@mui/material'
import UpIcon from '@mui/icons-material/VerticalAlignTop';
import DownIcon from '@mui/icons-material/VerticalAlignBottom';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIconIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import DownloadIcon from '@mui/icons-material/Unarchive';
import AddIcon from '@mui/icons-material/AddCircle';
import FilterIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Autorenew';
import Search from '../Search/Search';
import { Trans } from '../Translate';

export default function Toolbar(props) {
    const [openSearch, setOpenSearch] = useState(false);
    const {
        onSearch,
        onReorder,
        onRefreshClick,
        onExportClick,
        onFilterClick,
        onSettingClick,
        onAddClick,
        onCustomButtonClick,
        customButtonLabel,
        customButtonIcon,
        selectedRows,
        onEditClick,
        onDeleteClick,
        disableReorderUp,
        disableReorderDown,
        deleteIcon,
        selectedFilters,
        removeFilter,
        searchText,
        addLabel, editLabel, deleteLabel
    } = props;

    useEffect(() => {
        if (!!searchText && openSearch === false) {
            setOpenSearch(true);
        }
    }, [searchText]);

    var timerSearchText = null;

    function openSeach() {
        setOpenSearch(true);
    }

    function closeSeach() {
        setOpenSearch(false);
        onChangeSearchHandle("");
    }

    function onChangeSearchHandle(value) {
        window.clearTimeout(timerSearchText);
        timerSearchText = window.setTimeout(() => {
            if (typeof onSearch === 'function') {
                onSearch(value);
            }
        }, 400);
    }

    return (
        <>
            {selectedFilters && selectedFilters.length > 0 && <Box marginRight={2}>
                {selectedFilters.map((filter) => <Chip
                    label={filter.label}
                    color="primary"
                    onDelete={() => typeof removeFilter === 'function' ? removeFilter(filter.key) : null}
                    style={{ fontSize: 12, marginLeft: 3 }}
                    size="small"
                    key={filter.key}
                />)}
            </Box>}
            {typeof onSearch === 'function' &&
                <>
                    {openSearch &&
                        <Search searchText={searchText} handleOnChange={onChangeSearchHandle} onCancel={closeSeach} />
                    }
                    {!openSearch &&
                        <Tooltip title={<Trans translateKey="search" capitalize />}>
                            <IconButton
                                size='small'
                                onClick={openSeach} color="inherit">
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>
                    }
                </>
            }

            {(selectedRows === 1 && typeof onReorder === 'function') &&
                <>
                    {!disableReorderUp && <Tooltip title={<Trans translateKey="upItem" capitalize />}>
                        <IconButton
                            size='small'
                            onClick={() => onReorder(-1)} color="inherit">
                            <UpIcon />
                        </IconButton>
                    </Tooltip>}
                    {!disableReorderDown && <Tooltip title={<Trans translateKey="downItem" capitalize />}>
                        <IconButton
                            size='small'
                            onClick={() => onReorder(1)} color="inherit">
                            <DownIcon />
                        </IconButton>
                    </Tooltip>}
                </>
            }

            {typeof onExportClick === 'function' &&
                <Tooltip title={<Trans translateKey="export" capitalize />}>
                    <IconButton
                        size='small'
                        onClick={onExportClick} color="inherit">
                        <DownloadIcon />
                    </IconButton>
                </Tooltip>
            }

            {typeof onFilterClick === 'function' &&
                <Tooltip title={<Trans translateKey="filter" capitalize />}>
                    <IconButton
                        size='small'
                        onClick={onFilterClick} color="inherit">
                        <FilterIcon />
                    </IconButton>
                </Tooltip>
            }

            {typeof onSettingClick === 'function' &&
                <Tooltip title={<Trans translateKey="manage" capitalize />}>
                    <IconButton
                        size='small'
                        onClick={onSettingClick} color="inherit">
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            }

            {typeof onCustomButtonClick === 'function' &&
                <Tooltip title={customButtonLabel}>
                    <IconButton
                        size='small'
                        onClick={onCustomButtonClick} color="inherit">
                        {customButtonIcon}
                    </IconButton>
                </Tooltip>
            }

            {typeof onAddClick === 'function' &&
                <Tooltip title={addLabel || <Trans translateKey="add" capitalize />}>
                    <IconButton
                        size='small'
                        onClick={onAddClick} color="inherit">
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            }

            {(selectedRows === 1 && typeof onEditClick === 'function') &&
                <Tooltip title={editLabel || <Trans translateKey="edit" capitalize />}>
                    <IconButton
                        size='small'
                        onClick={onEditClick} color="inherit">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            }

            {(selectedRows > 0 && typeof onDeleteClick === 'function') &&
                <Tooltip title={deleteLabel || <Trans translateKey="delete" capitalize />}>
                    <IconButton
                        size='small'
                        onClick={onDeleteClick} color="inherit">
                        {deleteIcon || <DeleteIconIcon />}
                    </IconButton>
                </Tooltip>
            }

            {typeof onRefreshClick === 'function' &&
                <Tooltip title={<Trans translateKey="refresh" capitalize />}>
                    <IconButton
                        size='small'
                        onClick={onRefreshClick} color="inherit">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            }

        </>
    )
}