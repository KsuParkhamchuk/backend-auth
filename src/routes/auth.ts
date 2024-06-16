import express from "express";
import { findUserByEmail, createUser } from "../models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signin', async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const existingUser = await findUserByEmail(email);

        if(existingUser) {
            return res.status(400).json({message: 'User already exists'})
        }

        const user = await createUser(name, email, password);
        res.status(201).json({message: 'User was successfully created'})
    } catch (error: any) {
        return res.status(500).json({message: error.message})
    }
})

router.post('/login', async (req, res) => {
    const { email, password} = req.body;

    try {
        const user = await findUserByEmail(email);

        if(!user) {
            return res.status(400).json({message: 'Such user does not exist'})
        } 

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
        res.json(token)
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
})

export {router as authRoutes} 
