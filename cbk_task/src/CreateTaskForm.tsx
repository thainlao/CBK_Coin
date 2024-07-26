import { useState } from 'react';
import axios from 'axios';

const CreateTaskForm = () => {
    const [title, setTitle] = useState('Sub to TG');
    const [img, setImg] = useState('https://i.imgur.com/SLFXGf9.png');
    const [taskText, setTaskText] = useState('SUB TO OUR TG to get 150 CBK');
    const [reward, setReward] = useState('150');
    const [link, setLink] = useState('https://t.me/CyberKnightsbEST_bot');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateTask = async (e: any) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://31.129.105.130:3000/user/create-task', {
                title,
                img,
                task_text: taskText,
                reward: Number(reward),
                link
            });

            if (response.data.success) {
                setTitle('');
                setImg('');
                setTaskText('');
                setReward('');
                setLink('');
                setErrorMessage('');
            } else {
                setErrorMessage(response.data.message || 'Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setErrorMessage('Server error');
        }
    };

    return (
        <div className="create-task-form">
            <h2>Create Task</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleCreateTask}>
                <div className="form-group">
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Image URL:</label>
                    <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Task Text:</label>
                    <textarea value={taskText} onChange={(e) => setTaskText(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Reward:</label>
                    <input type="number" value={reward} onChange={(e) => setReward(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Link (optional):</label>
                    <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
                </div>
                <button type="submit">Create Task</button>
            </form>
        </div>
    );
};

export default CreateTaskForm;
