import React, { useState } from 'react';
import { ColorContext } from './ColorContex';

export const ColorProvider = ({ children }) => {
    const [color, setColor] = useState('#096bff');
    const changeColor = (color) => {
        setColor(color);
    };
    return (
        <ColorContext.Provider value={{ color, changeColor }}>
            {children}
        </ColorContext.Provider>
    );
}