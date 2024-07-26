import axios from "axios";
import { ISingleTaskProps } from "../utils/types";
import { useState } from "react";
import { serverApi } from "../utils/api";

const SingleTask: React.FC<ISingleTaskProps> = ({ singleTask, telegramId }) => {
    const [taskStatus, setTaskStatus] = useState(singleTask.status);

    const getButtonClass = () => {
        switch (singleTask.status) {
            case 'done':
                return 'btn-done';
            case 'claim':
                return 'btn-claim';
            case 'blocked':
                return 'btn-blocked';
            case 'open':
                return 'btn-open';
            default:
                return '';
        }
    };

    const getTaskClass = () => {
        switch (singleTask.status) {
            case 'done':
                return 'single_task--done';
            case 'claim':
                return 'single_task--claim';
            case 'blocked':
                return 'single_task--blocked';
            case 'open':
                return 'single_task--open'
            default:
                return '';
        }
    };

    const handleOpen = async () => {
        try {
            const response = await axios.post(`${serverApi}/user/update-task-status`, { telegramId, taskId: singleTask._id, newStatus: 'claim' });
            if (response.data.success) {
                setTaskStatus('claim');
                window.open(singleTask.link, '_blank');
                alert('Task is now claimable. Please click the "Claim" button to claim the reward.');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    const handleClaim = async () => {
        try {
            const response = await axios.post(`${serverApi}/user/claim-task`, { telegramId, taskId: singleTask._id });
            if (response.data.success) {
                setTaskStatus('done');
            }
        } catch (error) {
            console.error('Error claiming task:', error);
        }
    };

    return (
        <div className={`single_task ${getTaskClass()}`}>
            <div className="single_task1">
                <img loading="lazy" src={singleTask.img} alt={singleTask.title} />
                <div className="single_task_textsection">
                    <h3>{singleTask.title}</h3>
                    <p>{singleTask.task_text}</p>
                </div>
            </div>

            {taskStatus === 'open' && (
                <button className={getButtonClass()} onClick={handleOpen}>
                    Open
                </button>
            )}

            {taskStatus === 'claim' && (
                <button className={getButtonClass()} onClick={handleClaim}>
                    Claim
                </button>
            )}

            {taskStatus === 'blocked' && (
                <button className={getButtonClass()} disabled>
                    Blocked
                </button>
            )}

            {taskStatus === 'done' && (
                <button className={getButtonClass()} disabled>
                </button>
            )}
        </div>
    )
}

export default SingleTask;