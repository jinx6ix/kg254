-- =====================================================
-- Update admin user details in the existing Supabase database
-- =====================================================

-- NOTE: Replace 'new_hashed_password' with the actual bcrypt/argon2 hash of the admin password.
-- This script updates the admin user (username 'PTK Africa') with the correct email,
-- password hash, role, plan, and status. Run this in the Supabase SQL editor.

UPDATE public.users
SET email = 'ptk@ptkafrica.com',
    password = 'new_hashed_password',
    role = 'admin',
    plan = 'admin',
    status = 'active'
WHERE username = 'PTK Africa';
