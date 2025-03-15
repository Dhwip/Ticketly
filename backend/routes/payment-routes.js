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

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { selectedSeats, movieTitle, userId, movieId, date, totalAmount } = req.body;
        console.log('Received request:', { selectedSeats, movieTitle, userId, movieId, date, totalAmount });

        if (!selectedSeats || !movieTitle || !userId || !movieId || !date) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                received: { selectedSeats, movieTitle, userId, movieId, date }
            });
        }

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `Movie Tickets for ${movieTitle}`,
                            description: `${selectedSeats.length} seat(s) for ${new Date(date).toLocaleDateString()}`,
                        },
                        unit_amount: 15000, // 150 INR in paise
                    },
                    quantity: selectedSeats.length,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/booking/cancel`,
            metadata: {
                selectedSeats: JSON.stringify(selectedSeats),
                movieId,
                userId,
                date,
                totalAmount: (selectedSeats.length * 150).toString()
            }
        });

        console.log('Created session:', session.id);
        res.status(200).json({ 
            url: session.url, 
            sessionId: session.id,
            testCard: {
                number: '4242 4242 4242 4242',
                expiry: 'Any future date',
                cvc: 'Any 3 digits',
                zip: 'Any 5 digits'
            }
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ 
            error: 'Failed to create checkout session',
            details: error.message 
        });
    }
});

// Verify payment status and create booking
router.get('/verify-payment/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        
        if (session.payment_status === 'paid') {
            // Extract metadata from the session
            const { selectedSeats, movieId, userId, date, totalAmount } = session.metadata || {};
            
            // Check if booking already exists for this session
            const existingBooking = await Booking.findOne({ 'paymentInfo.sessionId': session.id });
            if (existingBooking) {
                return res.json({ 
                    status: session.payment_status,
                    booking: existingBooking,
                    message: 'Booking already exists'
                });
            }

            // Create a new booking
            const booking = new Booking({
                movie: movieId,
                user: userId,
                seatNumbers: JSON.parse(selectedSeats).map(Number),
                date: new Date(date),
                paymentInfo: {
                    sessionId: session.id,
                    status: 'completed',
                    amount: parseFloat(totalAmount)
                }
            });

            const existingMovie = await Movie.findById(movieId);
            if (!existingMovie) {
                return res.status(404).json({ message: "Movie not found" });
            }

            const dbSession = await mongoose.startSession();
            dbSession.startTransaction();

            try {
                await booking.save({ session: dbSession });
                existingMovie.bookings.push(booking);
                await existingMovie.save({ session: dbSession });
                await dbSession.commitTransaction();

                res.json({ 
                    status: session.payment_status,
                    booking: booking,
                    message: 'Booking created successfully'
                });
            } catch (error) {
                await dbSession.abortTransaction();
                throw error;
            } finally {
                dbSession.endSession();
            }
        } else {
            res.json({ status: session.payment_status });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

export default router; 