// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database configuration (using MongoDB as an example)
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define MongoDB Schema
const appointmentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    vehicleMake: String,
    vehicleModel: String,
    service: String,
    notes: String,
    date: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
app.post('/api/book-appointment', async (req, res) => {
    try {
        // Create new appointment
        const appointment = new Appointment(req.body);
        await appointment.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Appointment Confirmation - Prestige Detail',
            html: `
                <h2>Thank you for booking with Prestige Detail!</h2>
                <p>Your appointment details:</p>
                <ul>
                    <li>Name: ${req.body.firstName} ${req.body.lastName}</li>
                    <li>Service: ${req.body.service}</li>
                    <li>Vehicle: ${req.body.vehicleMake} ${req.body.vehicleModel}</li>
                </ul>
                <p>We will contact you shortly to confirm the exact time.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while booking your appointment.' });
    }
});

// Get all appointments (admin route)
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching appointments' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
