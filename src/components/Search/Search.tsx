import CancelIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import React, { useEffect, useState } from 'react';
import useStyles from './styles';

interface SearchProps {
    handleOnChange: (value: string) => void;
    onCancel?: () => void;
    searchText?: string;
}

export default function Search(props: SearchProps){

    const { handleOnChange, onCancel, searchText } = props;

    const [text, setText] = useState<string>();

    const classes = useStyles();

    useEffect(() => {
        setText(searchText);
    }, [searchText])

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        }
    }, []);

    function onChangeHandle(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const valueTxt = event.target.value;
        setText(valueTxt);
        if (typeof handleOnChange === 'function') handleOnChange(valueTxt)
    }

    function escFunction(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            if (typeof onCancel === 'function') onCancel();
        }
    }

    return (
        <div className={classes.search}>
            <InputBase
                value={text ? decodeURIComponent(text.toString().replace(/%/g,'%25')) : ''}
                autoFocus={true}
                placeholder={'Buscar'}
                onChange={(e) => onChangeHandle(e)}
                margin='dense'
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                startAdornment={
                    <SearchIcon />
                }
                endAdornment={
                    typeof onCancel === 'function' &&
                    (
                        <InputAdornment position="end">
                            <IconButton
                                size='small'
                                onClick={onCancel} >
                                <CancelIcon />
                            </IconButton>
                        </InputAdornment>
                    )
                }
            />
        </div>
    );
}