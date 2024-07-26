import { useState } from 'react';
import '../styles/error.css';


const ErrorPage = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const link = 'https://t.me/CyberKnightsbEST_bot/CBK_Short_bot';
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => console.error('Failed to copy text: ', err));
    };

    return (
        <div className='error'>
            <h1>Oops, something went wrong</h1>
            <h1>Try to refresh the page or run in telegram App</h1>
            <img src='https://i.imgur.com/SLFXGf9.png' loading='lazy' alt='Cyber Knight'/>
            <h2>Click the <a href='https://t.me/CyberKnightsbEST_bot'>link</a> to open</h2>
            <div className='error_section'>
                <h1>Or</h1>
                <button onClick={handleCopy}>
                    {copied ? 'Copied!' : 'Copy'}
                </button>
                <h1>the link</h1>
            </div>
            <h6 
            style={{color: 'white', fontSize: '1rem', fontWeight: '100'}}
            >version 10.07.2024 (add referal link) (6)
            </h6>
        </div>
    )
}

export default ErrorPage;