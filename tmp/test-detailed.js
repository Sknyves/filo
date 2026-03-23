const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vrizgfsmrjuuxrpqqshw.supabase.co';
const supabaseAnonKey = 'sb_publishable_CiCrHVOZEQxpSUECy56Cuw_78ICy6vj';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testListBuckets() {
    console.log('--- List Buckets Test ---');
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('❌ ERROR LISTING BUCKETS:', error.message);
    } else {
        console.log('Available buckets:', data.map(b => b.name));
    }
}

async function testSimpleUpload() {
    console.log('\n--- Simple Upload Test ---');
    const { data, error } = await supabase.storage
        .from('requests')
        .upload('test.txt', 'hello', { upsert: true });

    if (error) {
        console.error('❌ UPLOAD ERROR:', error.message, error.error || '');
    } else {
        console.log('✅ UPLOAD SUCCESS!');
    }
}

async function run() {
    await testListBuckets();
    await testSimpleUpload();
}

run();
