import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase environment variables in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
    console.log('Testing Database...');
    const { data, error } = await supabase
        .from('requests')
        .insert([
            {
                demandeur: 'TEST_AGENT',
                email: 'test@agent.com',
                service: 'Comptabilité',
                type: 'Graphisme',
                description: 'Test column file_urls',
                file_urls: ['https://example.com/test.pdf'],
                status: 'A faire'
            }
        ])
        .select();

    if (error) {
        if (error.code === '42703') {
            console.error('❌ COLUMN MISSING: The "file_urls" column does not exist in the "requests" table.');
        } else {
            console.error('❌ DATABASE ERROR:', error.message);
        }
    } else {
        console.log('✅ DATABASE READY: "file_urls" column is present and working.');
        // Clean up the test record
        if (data && data[0]) {
            await supabase.from('requests').delete().eq('id', data[0].id);
            console.log('Test record cleaned up.');
        }
    }
}

async function testStorage() {
    console.log('\nTesting Storage...');
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('❌ STORAGE ERROR:', error.message);
    } else {
        const bucketExists = data.some(b => b.name === 'requests');
        if (bucketExists) {
            console.log('✅ STORAGE READY: "requests" bucket exists.');
        } else {
            console.error('❌ BUCKET MISSING: The "requests" bucket does not exist.');
        }
    }
}

async function run() {
    await testDatabase();
    await testStorage();
}

run();
