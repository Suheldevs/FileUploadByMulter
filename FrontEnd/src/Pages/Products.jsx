import axios from 'axios';
import React, { useState } from 'react';

function Products() {
    const [images, setImages] = useState([]);

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append form fields to FormData
        formData.append('name', e.target.name.value);
        formData.append('price', e.target.price.value);
        formData.append('title', e.target.title.value);
        formData.append('category', e.target.category.value);
        formData.append('description', e.target.description.value);

        // Append images to FormData
        images.forEach((file) => formData.append('images', file));

        try {
            // Sending the form data to the backend
            const response = await axios.post('http://localhost:3001/products/registation', formData);
            console.log(response.data); // Logging the response data from the backend
        } catch (err) {
            console.error('Error uploading product:', err);
        }
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));  // Update the images state with selected files
    };

    return (
        <div>
            <form onSubmit={handleUpload}>
                Name: <input type="text" name="name" required />
                Price: <input type="number" name="price" required />
                Title: <input type="text" name="title" />
                Category:
                <select name="category">
                    <option value="Electronic">Electronic</option>
                    <option value="Cloths">Cloths</option>
                    <option value="Mens">Mens</option>
                    <option value="Womens">Womens</option>
                </select>
                Description: <textarea name="description" />
                Images: <input type="file" name="images" multiple onChange={handleImageChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    );
}

export default Products;
