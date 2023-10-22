import React from 'react';

interface action {
  title: string;
  icon?: React.Component;
  onClick: () => void;
}

interface DropdownButtonProps {
  title: string;
  icon?: React.Component;
  variant?: 'default' | 'success' | 'error';
  actions?: action[];
  components?: React.Component[];
  size?: 'small' | 'medium' | 'large';
}

export default function DropdownButton(props: DropdownButtonProps): React.Component;