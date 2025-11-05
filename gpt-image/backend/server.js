const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const AZURE_IMAGE_GEN_ENDPOINT = process.env.AZURE_IMAGE_GEN_ENDPOINT;
const AZURE_IMAGE_EDIT_ENDPOINT = process.env.AZURE_IMAGE_EDIT_ENDPOINT;

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/generate-image', async (req, res) => {
    const { prompt, size, quality, output_compression, output_format, n } = req.body;

    try {
        const response = await axios.post(
            AZURE_IMAGE_GEN_ENDPOINT,
            {
                prompt,
                size,
                quality,
                output_compression,
                output_format,
                n
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AZURE_API_KEY}`
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error generating image:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

app.post('/edit-image', upload.fields([{ name: 'image' }, { name: 'mask' }]), async (req, res) => {
    const { prompt } = req.body;
    const imageFile = req.files['image'][0];
    const maskFile = req.files['mask'] ? req.files['mask'][0] : null;

    try {
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('image', fs.createReadStream(imageFile.path), imageFile.originalname);
        if (maskFile) {
            formData.append('mask', fs.createReadStream(maskFile.path), maskFile.originalname);
        }

        const response = await axios.post(
            AZURE_IMAGE_EDIT_ENDPOINT,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${AZURE_API_KEY}`
                }
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error editing image:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to edit image' });
    } finally {
        // Clean up uploaded files
        fs.unlinkSync(imageFile.path);
        if (maskFile) {
            fs.unlinkSync(maskFile.path);
        }
    }
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
