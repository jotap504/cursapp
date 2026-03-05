import { seedCourses } from './src/firebase/seed.js';

console.log('Starting seed process...');
seedCourses()
    .then(() => {
        console.log('Seed executed successfully.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('Seed failed:', err);
        process.exit(1);
    });
