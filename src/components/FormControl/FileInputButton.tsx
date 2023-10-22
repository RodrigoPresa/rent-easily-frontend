import React, { ChangeEvent, MouseEvent } from "react";
import { Button } from "@mui/material";

export interface FileInputButtonProps {
    onFileChange: (file: File) => void;
    accept: string;
    color?: "error" | "inherit" | "success" | "warning" | "info" | "primary" | "secondary";
    variant?: 'text' | 'outlined' | 'contained';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    style?: React.CSSProperties;
    className?: string;
}

export class FileInputButton extends React.PureComponent<FileInputButtonProps> {

    refInputFile: React.RefObject<HTMLInputElement>;

    constructor(props: FileInputButtonProps) {
        super(props);

        this.refInputFile = React.createRef<HTMLInputElement>();

        this.buttonClickHandler = this.buttonClickHandler.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
    }

    inputChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        const { onFileChange } = this.props
        const input = e.target;
        if (input?.files && input.files.length > 0) {
            var file = input.files[0];
            if (typeof onFileChange === 'function') {
                onFileChange(file);
            }
        }
    }

    buttonClickHandler(e: MouseEvent<HTMLButtonElement>) {
        const input = this.refInputFile.current;
        input?.click();
    }

    render() {
        const {
            accept,
            children,
            color,
            style,
            className,
            disabled,
            variant,
            size
        } = this.props;
        return (
            <Button
                onClick={this.buttonClickHandler}
                color={color}
                style={style}
                className={className}
                disabled={disabled}
                variant={variant}
                size={size}
            >
                <input
                    ref={this.refInputFile}
                    type='file'
                    style={{ display: 'none' }}
                    onChange={this.inputChangeHandler}
                    multiple={false}
                    accept={accept}
                />
                {children}
            </Button>
        );
    }
};
