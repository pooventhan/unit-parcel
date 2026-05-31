import React from 'react';
import './Button.css';

interface InputProps {
  id: string;
  type: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  type,
}) => {
  return (
    <input id={id} name={id} type={type}> </input>
  );
};
