// index.js
const express = require('express');
const { createCanvas } = require('canvas');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Replace this with your actual domain when deploying
const DOMAIN = process.env.DOMAIN || 'http://localhost:3000';

// Serve the main HTML frame
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Claim Your Biscuit</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
            <meta property="fc:frame:button:1" content="🍪 CLAIM YOUR BISCUIT" />
            <meta property="fc:frame:post_url" content="${DOMAIN}/api/claim" />
            <meta property="fc:frame:image" content="${DOMAIN}/api/og" />
        </head>
        <body>
            <h1>Come And Get Your Free Biscuit</h1>
        </body>
        </html>
    `);
});

// Generate the image
app.get('/api/og', (req, res) => {
    const canvas = createCanvas(800, 418);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 800, 418);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Come And Get Your Free Biscuit', 400, 209);
    
    const buffer = canvas.toBuffer('image/png');
    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
});

// Handle the claim button
app.post('/api/claim', async (req, res) => {
    res.json({
        image: `${DOMAIN}/api/og`,
        buttons: [{ label: "🍪 CLAIM YOUR BISCUIT" }],
        action: {
            type: 'tx',
            chain: 'base',
            target: '0x2a392e42C2A74866ea52474e02aA779b95308d68',
            abi: [{
                "inputs": [],
                "name": "claim",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }],
            functionName: 'claim',
            args: []
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});