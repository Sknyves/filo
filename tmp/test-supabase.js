const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vrizgfsmrjuuxrpqqshw.supabase.co';
const supabaseAnonKey = 'sb_publishable_CiCrHVOZEQxpSUECy56Cuw_78ICy6vj';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabase() {
    console.log('--- Database Test ---');
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
            console.error('❌ COLUMN MISSING: The "file_urls" column does not exist.');
        } else {
            console.error('❌ DATABASE ERROR:', error.message, error.code);
        }
    } else {
        console.log('✅ DATABASE READY: "file_urls" column is present.');
        if (data && data[0]) {
            await supabase.from('requests').delete().eq('id', data[0].id);
            console.log('Test record cleaned up.');
        }
    }
}

async function testStorage() {
    console.log('\n--- Storage Test ---');
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error('❌ STORAGE ERROR:', error.message);
    } else {
        const bucketExists = data.some(b => b.name === 'requests');
        if (bucketExists) {
            console.log('✅ STORAGE READY: "requests" bucket exists.');
        } else {
            console.error('❌ BUCKET MISSING: The "requests" bucket does not exist.');
            console.log('Available buckets:', data.map(b => b.name).join(', ') || 'None');
        }
    }
}

async function run() {
    try {
        await testDatabase();
        await testStorage();
    } catch (e) {
        console.error('Unexpected error:', e);
    }
}

run();
