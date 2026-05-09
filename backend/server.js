const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_crm';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Lead Schema
const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['New', 'Contacted', 'Converted'], default: 'New' },
    notes: { type: String, default: '' },
    source: { type: String, default: 'Website Form' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', leadSchema);

// Admin User Schema (Simplified for Task 2)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// API ROUTES

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // For Task 2, we can check against env or a user in DB
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.json({ token, user: { email } });
        }
        res.status(400).json({ message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET all leads
app.get('/api/leads', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new lead
app.post('/api/leads', async (req, res) => {
    const { name, email, status, source } = req.body;
    try {
        const newLead = new Lead({ name, email, status, source });
        const savedLead = await newLead.save();
        res.json(savedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update lead
app.patch('/api/leads/:id', async (req, res) => {
    try {
        const { status, notes } = req.body;
        const updateData = { updatedAt: Date.now() };
        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const updatedLead = await Lead.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE lead
app.delete('/api/leads/:id', async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lead deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Statistics Endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const total = await Lead.countDocuments();
        const newLeads = await Lead.countDocuments({ status: 'New' });
        const contacted = await Lead.countDocuments({ status: 'Contacted' });
        const converted = await Lead.countDocuments({ status: 'Converted' });
        
        res.json({ total, new: newLeads, contacted, converted });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Nexus CRM Backend running on http://localhost:${PORT}`);
});