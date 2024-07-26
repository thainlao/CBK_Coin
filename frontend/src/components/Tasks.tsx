import { useEffect, useState } from 'react';
import '../styles/tasks.css';
import { ITasks, UserDataProps } from '../utils/types';
import SingleTask from './SingleTask';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import ErrorPage from '../pages/ErrorPage';
import { serverApi } from '../utils/api';

const Tasks: React.FC<UserDataProps> = ({userData, activeComponent}) => {
    const [tasks, setTasks] = useState<ITasks[]>([]);
    const [canCollect, setCanCollect] = useState<boolean>(false);
    const [nextAvailableTime, setNextAvailableTime] = useState<Date | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>('');

    if (!userData) {
        return <ErrorPage />
    }

    useEffect(() => {
        const fetchCollectionStatus = async () => {
            try {
                const response = await axios.post(`${serverApi}/user/daily-reward-status`, { telegramId: userData.telegramId });
                if (response.data.canCollect) {
                    setCanCollect(true);
                } else {
                    setCanCollect(false);
                    setNextAvailableTime(new Date(response.data.nextAvailableTime));
                }
            } catch (error) {
                console.error('Error fetching collection status:', error);
            }
        };
    
        fetchCollectionStatus();
    }, [userData.telegramId]);

    useEffect(() => {
        setTasks(userData.tasks)
    },
    [userData.telegramId, activeComponent])

    useEffect(() => {
        const interval = setInterval(() => {
            if (nextAvailableTime) {
                setTimeRemaining(getTimeRemaining(nextAvailableTime));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [nextAvailableTime]);


    const sortedTasks = [...tasks].sort((a,b) => {
        const statusOrder = { 'claim' : 1, 'open': 2, 'blocked': 3, 'done': 4};
        return statusOrder[a.status] - statusOrder[b.status]
    });
    
    const animatedPropsOnEnter = useSpring({
        from: { opacity: 0, transform: 'translateY(100px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { tension: 200, friction: 30 }
    });

    const handleCollectReward = async () => {
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        try {
            const response = await axios.post(`${serverApi}/user/collect-daily-reward`, { telegramId: userData.telegramId });
            if (response.data.success) {
                setCanCollect(false);
                setNextAvailableTime(new Date(response.data.dailyRewardCooldown));
                // Update user's CBK coins
                // Optionally show a success message
            } else {
                // Optionally show an error message
            }
        } catch (error) {
            console.error('Error collecting daily reward:', error);
        }
    };

    const getTimeRemaining = (endTime: Date) => {
        const total = Date.parse(endTime.toString()) - Date.parse(new Date().toString());
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const seconds = Math.floor((total / 1000) % 60);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <animated.div style={animatedPropsOnEnter} className='tasks'>
        <div className='text_section'>
            <h1>Cyber Knight Tasks</h1>
            <h2>You will receive <span>CBK$</span> by completing the task.</h2>
        </div>

        <div className='daily_section'>
            <h6>Get your daily reward with 150 <span>CBK$</span></h6>
        <button
            className={`daily_reward ${canCollect ? 'able' : 'disable'}`}
            onClick={handleCollectReward}
            disabled={!canCollect}
        >
            {canCollect ? 'Get Daily Reward!' : `Reward in: ${timeRemaining}`}
        </button>
        </div>

        <div className='tasks_section'>
            {sortedTasks.map((singleTask) => (
                <SingleTask key={singleTask._id} telegramId={userData.telegramId} singleTask={singleTask} />
            ))}
        </div>
    </animated.div>
    );
};

export default Tasks;
