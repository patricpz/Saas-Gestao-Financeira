// @ts-check
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase URL or Anon Key in environment variables');
    }

    console.log('Testing connection to Supabase...');
    console.log('Supabase URL:', supabaseUrl);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // List all tables in the public schema
    const { data: tables, error } = await supabase
      .rpc('get_table_names');
      
    if (error) {
      // If the function doesn't exist, try a different approach
      console.log('Trying alternative method to list tables...');
      const { data: schemaData, error: schemaError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');
        
      if (schemaError) throw schemaError;
      console.log('Available tables in public schema:', schemaData.map(t => t.tablename));
      return;
    }

    if (error) throw error;
    
    console.log('✅ Connection successful!');
    console.log('Available tables in public schema:', tables);
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.details) {
      console.error('Error details:', error.details);
    }
  }
}

testConnection();
