const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Replace with your Discord webhook URL
const discordWebhookUrl = 'https://discord.com/api/webhooks/1326652211115065456/Ov3JhvQDh23kUTCbOrPhhD2pFWSc2eOEqb88SaFjlrI4ZZ4Q2vNA0YQ0aBk45ia4m8QU';

app.get('/', (req, res) => {
    // Get the visitor's IP (handles proxies via X-Forwarded-For)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Send IP to Discord webhook
    axios.post(discordWebhookUrl, {
        content: `Visitor IP: ${ip}`  // This sends the IP back to the channel
    }).then(() => {
        console.log('IP sent to Discord');
    }).catch(err => {
        console.error('Error sending to Discord:', err);
    });

    // Display a simple page or echo the IP back to the user
    res.send(`Your IP is ${ip}. It has been sent via webhook for verification.`);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
