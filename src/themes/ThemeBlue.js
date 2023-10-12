import { createTheme } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { inputLabelClasses } from '@mui/material/InputLabel';
import { listItemClasses } from '@mui/material/ListItem';
import { inputBaseClasses } from '@mui/material/InputBase';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { formLabelClasses } from '@mui/material/FormLabel';
import { menuItemClasses } from '@mui/material/MenuItem';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { iconButtonClasses } from '@mui/material/IconButton';
import { svgIconClasses } from '@mui/material/SvgIcon';

//http://paletton.com/#uid=43u0I0kKQrYrNFhHRDiNQmIRwh3
//primary: #045B8E
//secondary1: #DFB500
//secondary2: #D90010
//complementary: #DF7B00

export const ThemeBlue = createTheme({
    spacing: 4,
    palette: {
        mode: 'light',
        primary: {
            main: '#045a8e'
        },
        secondary: {
            main: '#DFB500'
        },
        error: {
            main: '#D90010'
        },
    },
    typography: {

        // fontFamily: [
        //     'Roboto Regular',
        //     '"Segoe UI"',
        // ].join(',')
    },
    components: {
        MuiTable: {
            styleOverrides: {
                root: {
                    color: '#031527 !important',
                }
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    height: 32,
                    '&:nth-of-type(even)': {
                        backgroundColor: '#f6f6f6'
                    },
                },
                head: {
                    height: 32,
                    backgroundImage: 'linear-gradient(#f0f3f4, #d5e0e4)',
                },
                hover: {
                    '&:hover': {
                        cursor: 'pointer'
                    }
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    fontSize: 16,
                    color: '#031527 !important',
                    textAlign: 'center !important',
                    fontWeight: 'bold !important',
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: undefined,
                    border: '1px solid #031527',
                    padding: `${4}px ${8}px`,
                    '&:last-child': {
                        paddingRight: undefined
                    },
                },
                head: {
                    color: 'rgba(0, 0, 0, 0.87) !important',
                    fontSize: 16,
                },
                stickyHeader: {
                    backgroundImage: 'linear-gradient(#f0f3f4, #d5e0e4)',
                }
            }
        },
        MuiTablePagination: {
            styleOverrides: {
                toolbar: {
                    minHeight: '32px !important',
                    height: 32,
                    paddingRight: 8
                },
                selectRoot: {
                    marginRight: 24
                },
                selectIcon: {
                    //fontSize: '1.2rem',
                    //position: 'relative',
                    //left: -20
                    top: undefined
                },
                select: {
                    //paddingRight: 16
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    lineHeight: undefined,
                    minHeight: 32,
                    [`&.${menuItemClasses.selected}`]: {
                        backgroundColor: '#cfebff',
                        fontWeight: 600
                    }
                }
            }
        },
        MuiList: {
            styleOverrides: {
                padding: {
                    paddingTop: 4,
                    paddingBottom: 4,
                }
            }
        },
        MuiFormControl: {
            styleOverrides: {
                marginDense: {
                    marginTop: 4,
                    marginBottom: 4,
                    [`& .${inputLabelClasses.root}`]: {
                        transform: 'translate(8px, 9px) scale(1)',
                        fontSize: 14,
                        color: 'gray'
                    },
                    [`& .${inputBaseClasses.root}`]: {
                        lineHeight: undefined,
                        padding: 4
                    },
                    [`& .${inputBaseClasses.input}`]: {
                        padding: 4,
                        fontSize: 14
                    },
                    [`& .${formHelperTextClasses.root}`]: {
                        marginTop: 2,
                        fontSize: 11
                    }
                },
            }
        },
        MuiInputAdornment: {
            styleOverrides: {
                positionEnd: {
                    [`& .${iconButtonClasses.edgeEnd}`]: {
                        padding: undefined,
                        marginRight: 0
                    }
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    [`&.${inputLabelClasses.outlined}.${inputLabelClasses.shrink}`]: {
                        color: 'unset',
                        transform: 'translate(14px, -8px) scale(0.8)'
                    },
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    '&:not(.Mui-error)': {
                        [`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: '#031527'
                        },
                        [`& .${outlinedInputClasses.notchedOutline}`]: {
                            borderColor: '#031527'
                        },
                    }
                },
            }
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    [`& .${outlinedInputClasses.root}`]: {
                        padding: 4
                    },
                },
                inputRoot: {
                    [`& .${outlinedInputClasses.input}`]: {
                        padding: 4,
                        [`&.${autocompleteClasses.input}`]: {
                            padding: '4px 4px',
                        },
                    },
                },
                listbox: {
                    padding: '4px 0'
                },
                option: {
                    '&[aria-selected="true"]': {
                        backgroundColor: '#cfebff !important',
                        fontWeight: 600
                    }
                },
                paper: {
                    lineHeight: undefined,
                    border: '1px solid #515151'
                },
                endAdornment: {
                    top: 'unset'
                },
                clearIndicator: {
                    [`& .${svgIconClasses.fontSizeSmall}`]: {
                        fontSize: '1rem'
                    }
                }
            }
        },
        PrivateNotchedOutline: {
            root: {
                borderRadius: 1
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    [`&:not(${formLabelClasses.error})`]: {
                        color: '#031527'
                    }
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    color: 'rgba(0, 0, 0, 0.87)',
                    [`&.${listItemClasses.selected}`]: {
                        backgroundColor: '#cfebff !important',
                        fontWeight: 600
                    },
                    '& [class*="PrivateSwitchBase-root"]': {
                        padding: 6
                    }
                },
            }
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    minHeight: 32,
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    minHeight: 32,
                    '@media (min-width: 960px)': {
                        minWidth: 100
                    },
                    padding: '4px 8px'
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                selectMenu: {
                    display: 'flex',
                    alignItems: 'center'
                },
                icon: {
                    fontSize: '1.2rem',
                    position: 'absolute',
                    right: 8,
                    top: undefined,
                    color: 'rgba(0, 0, 0, 0.54)',
                    cursor: 'pointer',
                    '&:hover': {
                        color: 'inherit',
                    }
                },
                select: {
                    height: '1rem',
                    lineHeight: '1rem',
                    [`&.${inputBaseClasses.input}`]: {
                        display: 'flex',
                        alignItems: 'center'
                    }
                }
            }
        },
        MuiStepLabel: {
            styleOverrides: {
                iconContainer: {
                    fontSize: '1.2rem'
                }
            }
        },
        MuiStepper: {
            styleOverrides: {
                root: {
                    padding: 16
                }
            }
        },
        MuiSvgIcon: {
            defaultProps: {
                fontSize: 'small'
            },
            styleOverrides: {
                root: {
                    fontSize: undefined
                },
                fontSizeSmall: {
                    fontSize: '1.1rem'
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                h6: {
                    fontSize: '1rem',
                    lineHeight: 1.5
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                sizeSmall: {
                    fontSize: '0.7rem'
                }
            }
        },
        MuiDialogTitle: {
            styleOverrides: {
                root: {
                    padding: '16px 16px 8px 16px'
                }
            }
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    padding: '8px 16px'
                }
            }
        },
        MuiExpansionPanelSummary: {
            root: {
                minHeight: 32
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    height: 24
                }
            }
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    padding: 0
                }
            }
        }
    }
});