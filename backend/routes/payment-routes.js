import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Booking from '../models/Bookings.js';
import Movie from '../models/Movie.js';
import mongoose from 'mongoose';

dotenv.config();
const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Test route to verify the router is working
router.get('/test', (req, res) => {
    res.json({ message: 'Payment router is working' });
});

router.post('/create-session', async (req, res) => {
    try {
        const { seatNumbers, movieTitle, movieId, date, theater, timeSlot, userId } = req.body;

        // Log the received data for debugging
        console.log('Received booking data:', {
            seatNumbers,
            movieTitle,
            movieId,
            date,
            theater,
            timeSlot,
            userId
        });

        // Calculate total amount
        const totalAmount = seatNumbers.length * timeSlot.price;

        // Create a new booking with payment info
        const booking = new Booking({
            movie: movieId,
            seatNumbers,
            date: new Date(date),
            user: userId,
            theater: {
                name: theater.name,
                location: theater.location
            },
            timeSlot: {
                time: timeSlot.time,
                price: timeSlot.price
            },
            paymentInfo: {
                amount: totalAmount,
                sessionId: '', // Will be updated after Stripe session creation
                status: 'pending'
            }
        });

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: movieTitle,
                            description: `${theater.name} - ${theater.location} - ${timeSlot.time}`,
                        },
                        unit_amount: timeSlot.price * 100, // Convert to paise
                    },
                    quantity: seatNumbers.length,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
            metadata: {
                bookingId: booking._id.toString(),
                movieId,
                seatNumbers: JSON.stringify(seatNumbers),
                date,
                theater: JSON.stringify(theater),
                timeSlot: JSON.stringify(timeSlot),
                userId
            }
        });

        // Update booking with Stripe session ID
        booking.paymentInfo.sessionId = session.id;
        await booking.save();

        return res.status(200).json({
            url: session.url,
            sessionId: session.id
        });
    } catch (error) {
        console.error('Payment session creation error:', error);
        return res.status(500).json({
            message: 'Failed to create payment session',
            error: error.message
        });
    }
});

router.get('/verify-payment/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            // Update booking status
            const booking = await Booking.findOne({ 'paymentInfo.sessionId': sessionId });
            if (booking) {
                // Update payment info
                booking.paymentInfo.status = 'completed';
                await booking.save();

                // Update movie bookings
                const movie = await Movie.findById(booking.movie);
                if (movie) {
                    movie.bookings.push(booking);
                    await movie.save();
                }

                return res.status(200).json({
                    message: 'Payment verified successfully',
                    booking,
                    status: 'success'
                });
            } else {
                return res.status(404).json({
                    message: 'Booking not found',
                    status: 'error'
                });
            }
        }

        return res.status(400).json({
            message: 'Payment not completed',
            status: 'error'
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return res.status(500).json({
            message: 'Failed to verify payment',
            error: error.message,
            status: 'error'
        });
    }
});

export default router; 