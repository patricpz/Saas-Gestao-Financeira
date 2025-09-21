require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkSupabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase URL or Anon Key in environment variables');
    }

    console.log('🔄 Testing Supabase connection...');
    console.log('🔗 Supabase URL:', supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by getting the current user
    console.log('\n🔍 Testing authentication...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) throw authError;
    console.log('✅ Authentication successful!');
    
    if (session) {
      console.log('👤 User email:', session.user.email);
    } else {
      console.log('ℹ️ No active session - running in anonymous mode');
    }
    
    // Test a simple query to check database access
    console.log('\n🔍 Testing database access...');
    try {
      // Try to list all tables using information_schema
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) throw tablesError;
      
      console.log('✅ Database connection successful!');
      console.log('📋 Available tables in public schema:');
      if (tables && tables.length > 0) {
        tables.forEach(table => console.log(`- ${table.table_name}`));
      } else {
        console.log('No tables found in the public schema.');
      }
      
    } catch (dbError) {
      console.log('⚠️ Could not list tables. This might be due to RLS policies or missing permissions.');
      console.log('Error details:', dbError.message);
      
      // Try to fetch a simple value
      console.log('\n🔍 Testing with a simple query...');
      try {
        const { data, error } = await supabase
          .from('profiles')  // Common table name in Supabase
          .select('*')
          .limit(1);
          
        if (error) throw error;
        console.log('✅ Successfully queried profiles table:', data);
      } catch (queryError) {
        console.log('❌ Could not query profiles table:', queryError.message);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:');
    console.error(error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.hint) {
      console.error('Hint:', error.hint);
    }
  }
}

checkSupabase();
