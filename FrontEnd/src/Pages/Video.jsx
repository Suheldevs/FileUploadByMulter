import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Video() {
    const [video, setVideo] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Handle file change
    const videoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setVideo(file);
        } else {
            alert("Please upload a valid video file.");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!video) {
            alert("Please select a video to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('name', e.target.name.value);
        formData.append('video', video);

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:3004/video/post', formData);
            setMessage(res.data.message || 'Video uploaded successfully!');
            getData(); // Refresh the list after upload
        } catch (err) {
            console.error(err);
            setMessage('Error uploading video.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch video data
    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:3004/video/get');
            setData(response.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h2>Upload a Video</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" name="name" required />
                </label>
                <label>
                    Video:
                    <input type="file" name="video" onChange={videoChange} accept="video/*" />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Save'}
                </button>
            </form>

            {message && <p>{message}</p>}

            <div className="video-list">
                <h2>Uploaded Videos</h2>
                {data.map((item) => (
                    <div key={item._id} className="video-item">
                        <p>Name: <strong>{item.name}</strong></p>
                        <video
                            src={`http://localhost:3004/videos/${item.video}`}
                            controls
                            width="400"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Video;
