// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/prestige-detail', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    vehicleMake: String,
    vehicleModel: String,
    selectedServices: [{
        name: String,
        price: Number
    }],
    totalPrice: Number,
    appointmentDate: Date,
    appointmentTime: String,
    status: {
        type: String,
        default: 'pending'
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

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
        const booking = new Booking(req.body);
        await booking.save();

        // Send confirmation email to customer
        const customerEmail = {
            from: process.env.EMAIL_USER,
            to: booking.email,
            subject: 'Booking Confirmation - Prestige Detail',
            html: `
                <h2>Thank you for booking with Prestige Detail!</h2>
                <p>Your appointment details:</p>
                <ul>
                    <li>Date: ${new Date(booking.appointmentDate).toLocaleDateString()}</li>
                    <li>Time: ${booking.appointmentTime}</li>
                    <li>Services:</li>
                    ${booking.selectedServices.map(service => `
                        <li>${service.name} - $${service.price}</li>
                    `).join('')}
                </ul>
                <p>Total Price: $${booking.totalPrice}</p>
                <p>Vehicle: ${booking.vehicleMake} ${booking.vehicleModel}</p>
                <p>If you need to make any changes to your appointment, please contact us.</p>
            `
        };

        // Send notification email to admin
        const adminEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Booking - Prestige Detail',
            html: `
                <h2>New Booking Received</h2>
                <p>Customer Details:</p>
                <ul>
                    <li>Name: ${booking.firstName} ${booking.lastName}</li>
                    <li>Email: ${booking.email}</li>
                    <li>Phone: ${booking.phone}</li>
                    <li>Vehicle: ${booking.vehicleMake} ${booking.vehicleModel}</li>
                </ul>
                <p>Appointment: ${new Date(booking.appointmentDate).toLocaleDateString()} at ${booking.appointmentTime}</p>
                <p>Services: ${booking.selectedServices.map(s => s.name).join(', ')}</p>
                <p>Total: $${booking.totalPrice}</p>
                <p>Notes: ${booking.notes || 'None'}</p>
            `
        };

        await transporter.sendMail(customerEmail);
        await transporter.sendMail(adminEmail);

        res.json({ success: true, bookingId: booking._id });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Failed to process booking' });
    }
});

// Get available time slots for a specific date
app.get('/api/available-times', async (req, res) => {
    const date = new Date(req.query.date);
    const existingBookings = await Booking.find({
        appointmentDate: {
            $gte: new Date(date.setHours(0,0,0)),
            $lt: new Date(date.setHours(23,59,59))
        }
    });

    const businessHours = {
        start: 8, // 8 AM
        end: 18, // 6 PM
        interval: 30 // 30-minute intervals
    };

    const bookedTimes = existingBookings.map(b => b.appointmentTime);
    const availableTimes = [];

    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        for (let minute = 0; minute < 60; minute += businessHours.interval) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            if (!bookedTimes.includes(timeString)) {
                availableTimes.push(timeString);
            }
        }
    }

    res.json(availableTimes);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
