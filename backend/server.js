const express = require('express');
const cors = require('cors');

const app = express();

// Middleware to allow the frontend to talk to the backend safely
app.use(cors());
app.use(express.json());

// Our temporary "database" holding the leads
let leads = [
    { id: 1, name: "Sarah Connor", email: "sarah@example.com", status: "New" },
    { id: 2, name: "Bruce Wayne", email: "bruce@wayne.com", status: "Contacted" }
];

// API ROUTE 1: Send all leads to the frontend when it asks
app.get('/api/leads', (req, res) => {
    res.json(leads);
});

// API ROUTE 2: Receive a new lead from the frontend and save it
app.post('/api/leads', (req, res) => {
    const newLead = { 
        id: Date.now(), // Generate a random ID
        name: req.body.name, 
        email: req.body.email, 
        status: req.body.status 
    };
    leads.push(newLead); // Save it to our list
    res.json(newLead);   // Tell the frontend it was successful
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});