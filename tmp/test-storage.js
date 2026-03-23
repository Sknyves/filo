const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vrizgfsmrjuuxrpqqshw.supabase.co';
const supabaseAnonKey = 'sb_publishable_CiCrHVOZEQxpSUECy56Cuw_78ICy6vj';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorageUpload() {
    console.log('--- Storage Upload Test ---');
    const content = 'test file content';
    const filePath = `test-${Date.now()}.txt`;
    
    const { data, error } = await supabase.storage
        .from('requests')
        .upload(filePath, content);

    if (error) {
        if (error.message.includes('bucket not found') || error.error === 'Bucket not found') {
            console.error('❌ BUCKET MISSING: The "requests" bucket does not exist.');
        } else {
            console.error('❌ STORAGE UPLOAD ERROR:', error.message, error.error);
        }
    } else {
        console.log('✅ STORAGE READY: Successfully uploaded a test file to "requests" bucket.');
        // Clean up
        await supabase.storage.from('requests').remove([filePath]);
        console.log('Test file cleaned up.');
    }
}

testStorageUpload();
