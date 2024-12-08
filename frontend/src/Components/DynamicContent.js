import React, { useEffect } from 'react';

const DynamicContent = ({ htmlContent }) => {
    useEffect(() => {
        // Dynamically load Twitter's script for rendering tweets
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
        style={{
            padding: '15px',
            border: '1px solid #f0f0f0',
            borderRadius: '5px',
            background: '#fafafa',
        }}
    />;
};

export default DynamicContent;
