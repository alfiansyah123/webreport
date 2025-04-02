const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        
        let contentType = 'text/html';
        if (filePath.endsWith('.js')) contentType = 'application/javascript';
        if (filePath.endsWith('.css')) contentType = 'text/css';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');
    
    // Simulasi data lead baru
    const networks = ['Google Ads', 'Facebook', 'Instagram', 'TikTok'];
    const countries = ['us', 'gb', 'ca', 'au'];
    
    const sendNewLead = () => {
        const newLead = {
            id: `#${Math.floor(1000 + Math.random() * 9000)}`,
            network: networks[Math.floor(Math.random() * networks.length)],
            country: countries[Math.floor(Math.random() * countries.length)],
            traffic: Math.floor(Math.random() * 30000),
            earning: Math.floor(Math.random() * 2000),
            date: new Date().toISOString().split('T')[0],
            cpu: `${Math.floor(30 + Math.random() * 50)}%`,
            memory: `${Math.floor(40 + Math.random() * 50)}%`,
            bandwidth: `${Math.floor(100 + Math.random() * 400)} Mbps`,
            status: ['Normal', 'Tinggi', 'Sedang'][Math.floor(Math.random() * 3)]
        };
        
        ws.send(JSON.stringify(newLead));
    };
    
    // Kirim lead baru setiap 10-30 detik
    const interval = setInterval(sendNewLead, 10000 + Math.random() * 20000);
    
    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});

server.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});