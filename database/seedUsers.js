require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const sampleUsers = [
    {
        email: 'john.doe@example.com',
        password: 'Password123!',
        fullName: 'John Doe',
        avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        statistics: {
            eventsAttended: 5,
            upcomingEvents: 2,
            favoriteClubs: 3
        },
        settings: {
            emailNotifications: true,
            pushNotifications: true,
            themePreference: 'dark'
        }
    },
    {
        email: 'jane.smith@example.com',
        password: 'Password123!',
        fullName: 'Jane Smith',
        avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
        statistics: {
            eventsAttended: 8,
            upcomingEvents: 3,
            favoriteClubs: 5
        },
        settings: {
            emailNotifications: true,
            pushNotifications: false,
            themePreference: 'light'
        }
    },
    {
        email: 'mike.wilson@example.com',
        password: 'Password123!',
        fullName: 'Mike Wilson',
        avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        statistics: {
            eventsAttended: 3,
            upcomingEvents: 1,
            favoriteClubs: 2
        },
        settings: {
            emailNotifications: false,
            pushNotifications: true,
            themePreference: 'dark'
        }
    },
    {
        email: 'sarah.johnson@example.com',
        password: 'Password123!',
        fullName: 'Sarah Johnson',
        avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        statistics: {
            eventsAttended: 12,
            upcomingEvents: 4,
            favoriteClubs: 6
        },
        settings: {
            emailNotifications: true,
            pushNotifications: true,
            themePreference: 'light'
        }
    },
    {
        email: 'admin@nightmare.com',
        password: 'Admin123!',
        fullName: 'Admin User',
        avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
        statistics: {
            eventsAttended: 15,
            upcomingEvents: 5,
            favoriteClubs: 8
        },
        settings: {
            emailNotifications: true,
            pushNotifications: true,
            themePreference: 'dark'
        }
    }
];

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        console.log('Cleared existing users');

        // Insert users one by one so pre-save middleware runs
        const createdUsers = [];
        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }
        console.log(`Successfully created ${createdUsers.length} users`);
        createdUsers.forEach(user => {
            console.log(`Created user: ${user.fullName} (${user.email})`);
        });
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedUsers(); 