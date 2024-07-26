import React, { useEffect, useState } from 'react';
import '../styles/base.css';
import lock from '../assets/icons8-lock-50.png';
import { useSpring, animated } from 'react-spring';
import { baseProps } from '../utils/types';
import axios from 'axios';
import ErrorPage from '../pages/ErrorPage';
import { serverApi } from '../utils/api';


const Base: React.FC<baseProps> = ({ userData, canCollect, nextAvailableTime, checkCollectionStatus }) => {
    const [buttonBlocked, setButtonBlocked] = useState<boolean>(true);
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

    if (!userData) {
        return <ErrorPage />
    }
    
    useEffect(() => {
        if (nextAvailableTime) {
            const interval = setInterval(() => {
                const now = new Date();
                const diff = nextAvailableTime.getTime() - now.getTime();
                if (diff <= 0) {
                    setTimeRemaining(null);
                    setButtonBlocked(false);
                    clearInterval(interval);
                } else {
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
                }
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setButtonBlocked(!canCollect)
        }
    }, [nextAvailableTime, canCollect]);

    const handleCollect = () => {
        if (!buttonBlocked) {
            if (navigator.vibrate) {
                navigator.vibrate(100); 
            }
            axios.post(`${serverApi}/user/collect-coins`, { telegramId: userData.telegramId })
                .then(response => {
                    if (response.data.success) {
                        userData.cbkCoins = response.data.cbkCoins;
                        userData.lastCollected = response.data.lastCollected;
                        setButtonBlocked(true);
                        checkCollectionStatus(userData.telegramId);
                    } else {
                        console.error(response.data.message);
                    }
                })
                .catch(error => {
                    console.error('Error collecting coins', error);
                });
        }
    };

    const animatedProps = useSpring({
        count: userData.cbkCoins,
        config: { tension: 100, friction: 100, duration: 1500 },
    });

    const animatedPropsOnEnter = useSpring({
        from: { opacity: 0, transform: 'translateY(100px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { tension: 200, friction: 30 }
    });

    return (
        <animated.div style={animatedPropsOnEnter} className='base'>
            <section className='useravatar_section'>
                <h1>{userData.username}</h1>
                <img className='avatar' src='https://i.imgur.com/SLFXGf9.png' loading='lazy' alt='avatar'/>
            </section>

            <div className='collect_section'>
                <h3>Collect <span>CBK$</span></h3>
                
                <animated.h4 style={{ fontSize: '3.5rem', fontWeight: 500 }}>
                    {animatedProps.count.interpolate((val: number) => val.toFixed(1))}
                </animated.h4>
            </div>

            <button 
                className={`collect_button ${buttonBlocked ? 'blocked' : ''}`}
                onClick={handleCollect}
                disabled={buttonBlocked}  // Исправлено здесь
            >
                {buttonBlocked ? `${timeRemaining || '...'} to collect` : 'COLLECT CBK$'}
                {buttonBlocked && <img src={lock} alt="lock" />}
            </button>
        </animated.div>
    );
};

export default Base;