import React from 'react';
import StyleContext from 'isomorphic-style-loader/StyleContext';

const insertCss = (...styles) => {
    const removeCss = styles.map(style => style._insertCss());
    return () => removeCss.forEach(dispose => dispose());
};

export default function ClientStyles({ children }) {
    return !!global.USSR_IN_PRODUCTION ? children : <StyleContext.Provider value={{ insertCss }}>
        {children}
    </StyleContext.Provider>;
}
