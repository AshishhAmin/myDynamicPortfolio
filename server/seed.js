import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const seed = async () => {
    const client = await pool.connect();
    try {
        console.log('🌱 Seeding database with frontend content...\n');

        // --- ABOUT ---
        await client.query('DELETE FROM about');
        await client.query(
            'INSERT INTO about (description) VALUES ($1)',
            ['Specialized in crafting high-performance web experiences and intelligent systems. I bridge the gap between complex backend logic and seamless frontend interactions, leverage AI-driven workflows as a Prompt Engineer to accelerate development, and focus on clean, scalable architecture that stands the test of time.']
        );
        console.log('✓ About section seeded');

        // --- EXPERIENCE & EDUCATION ---
        await client.query('DELETE FROM experience');
        const experiences = [
            {
                type: 'experience',
                title: 'Senior Full-Stack Developer',
                organization: 'TechFlow Systems',
                period: '2023 - Present',
                description: 'Lead developer for core banking infrastructure. Managed a team of 5 engineers to migrate legacy services to modern React/Node architecture.'
            },
            {
                type: 'experience',
                title: 'Full-Stack Developer',
                organization: 'Digital Artisans',
                period: '2021 - 2023',
                description: 'Developed and maintained 15+ high-traffic client websites. Implemented CI/CD pipelines reducing deployment time by 40%.'
            },
            {
                type: 'education',
                title: 'Bachelor of Technology in CS',
                organization: 'Global Institute of Technology',
                period: '2017 - 2021',
                description: 'Specialization in Software Engineering. Graduated with honors. Lead researcher for the University AI Lab.'
            },
            {
                type: 'education',
                title: 'Higher Secondary Education',
                organization: 'Oakridge International',
                period: '2015 - 2017',
                description: 'Major in Physics, Chemistry, and Mathematics.'
            }
        ];
        for (const exp of experiences) {
            await client.query(
                'INSERT INTO experience (type, title, organization, period, description) VALUES ($1, $2, $3, $4, $5)',
                [exp.type, exp.title, exp.organization, exp.period, exp.description]
            );
        }
        console.log(`✓ Experience/Education seeded (${experiences.length} entries)`);

        // --- SKILLS ---
        await client.query('DELETE FROM skills');
        const skillGroups = [
            {
                category: 'Engineering',
                skills: ['React', 'Node.js', 'PostgreSQL', 'Django', 'Next.js', 'Express', 'MongoDB', 'Python']
            },
            {
                category: 'Design & Motion',
                skills: ['Tailwind CSS', 'Framer Motion', 'Vanilla CSS', 'UI Architecture', 'Layout Design']
            },
            {
                category: 'Modern Stack & AI',
                skills: ['Prompt Engineering', 'Vite', 'Cloudinary', 'Neon DB', 'MQTT', 'Vector Search']
            }
        ];
        for (const group of skillGroups) {
            await client.query(
                'INSERT INTO skills (category, skills) VALUES ($1, $2)',
                [group.category, group.skills]
            );
        }
        console.log(`✓ Skills seeded (${skillGroups.length} categories)`);

        // --- CONTACT ---
        await client.query('DELETE FROM contact');
        await client.query(
            'INSERT INTO contact (email, availability_status, socials) VALUES ($1, $2, $3)',
            [
                'ashuamin480@gmail.com',
                'Currently open for select collaborations',
                JSON.stringify([
                    { label: 'GitHub', href: 'https://github.com/' },
                    { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
                    { label: 'Instagram', href: 'https://instagram.com/' },
                    { label: 'Email', href: 'mailto:ashuamin480@gmail.com' }
                ])
            ]
        );
        console.log('✓ Contact section seeded');

        console.log('\n🎉 Database seeded successfully! Refresh the portfolio to see live data.');
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
    } finally {
        client.release();
        process.exit(0);
    }
};

seed();
