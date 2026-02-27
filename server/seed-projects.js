import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const seedProjects = async () => {
    const client = await pool.connect();
    try {
        console.log('🌱 Seeding projects...');

        const projects = [
            {
                title: 'Cashflow App',
                description: 'Personal finance tracker with real-time analytics and predictive insights.',
                tech_stack: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
                image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                live_link: ''
            },
            {
                title: 'Digital Census Portal',
                description: 'High-scale data collection architecture for national surveys.',
                tech_stack: ['Next.js', 'PostgreSQL', 'Prisma'],
                image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                live_link: ''
            },
            {
                title: 'AGRITECH System',
                description: 'IoT dashboard for monitoring soil moisture and automated irrigation.',
                tech_stack: ['Vue', 'Express', 'MQTT'],
                image_url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
                live_link: ''
            },
            {
                title: 'Neon Cyber Store',
                description: 'E-commerce platform with 3D product visualization.',
                tech_stack: ['React Three Fiber', 'Stripe', 'Supabase'],
                image_url: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&w=800&q=80',
                live_link: ''
            }
        ];

        for (const p of projects) {
            await client.query(
                'INSERT INTO projects (title, description, tech_stack, image_url, live_link) VALUES ($1, $2, $3, $4, $5)',
                [p.title, p.description, p.tech_stack, p.image_url, p.live_link]
            );
            console.log(`  ✓ Added: ${p.title}`);
        }

        console.log('\n🎉 Projects seeded! Reload the admin Works tab to see them.');
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        client.release();
        process.exit(0);
    }
};

seedProjects();
