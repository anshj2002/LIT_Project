#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
  console.log('   Please ensure .env.local exists with:');
  console.log('   - VITE_SUPABASE_URL');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function quickCheck() {
  try {
    console.log('🔍 Quick Admin Check');
    console.log('==================');

    // Check admin_users table
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*');

    if (adminError) {
      console.log('❌ Error accessing admin_users:', adminError.message);
      return;
    }

    console.log('✅ Found', adminUsers.length, 'admin users:');
    adminUsers.forEach(user => {
      console.log('  -', user.email, '(ID:', user.user_id, ')');
    });

    // Test is_admin function
    const { data: isAdminResult, error: isAdminError } = await supabase.rpc('is_admin');

    if (isAdminError) {
      console.log('❌ is_admin() function error:', isAdminError.message);
      console.log('💡 This usually means the function is missing from the database');
    } else {
      console.log('✅ is_admin() function works, result:', isAdminResult);
    }

    // Check auth users
    console.log('\n🔍 Checking auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.log('❌ Error accessing auth.users:', authError.message);
    } else {
      console.log('✅ Found', authUsers.users.length, 'users in auth:');
      authUsers.users.forEach(user => {
        const isAdmin = adminUsers.some(au => au.user_id === user.id);
        console.log(`  - ${user.email} ${isAdmin ? '(ADMIN)' : ''} (ID: ${user.id})`);
      });
    }

  } catch (error) {
    console.log('💥 Error:', error.message);
  }
}

quickCheck();

