import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema initialization
export const initializeDatabase = async () => {
  try {
    // Create Users table
    const { error: usersError } = await supabase.rpc('create_users_table');
    if (usersError && !usersError.message.includes('already exists')) {
      console.error('Error creating users table:', usersError);
    }

    // Create Contacts table
    const { error: contactsError } = await supabase.rpc('create_contacts_table');
    if (contactsError && !contactsError.message.includes('already exists')) {
      console.error('Error creating contacts table:', contactsError);
    }

    // Create ContactGroups table
    const { error: groupsError } = await supabase.rpc('create_contact_groups_table');
    if (groupsError && !groupsError.message.includes('already exists')) {
      console.error('Error creating contact groups table:', groupsError);
    }

    // Create ContactGroupMembers junction table
    const { error: membersError } = await supabase.rpc('create_contact_group_members_table');
    if (membersError && !membersError.message.includes('already exists')) {
      console.error('Error creating contact group members table:', membersError);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// User operations
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserByFarcasterProfile = async (farcasterProfileId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('farcaster_profile_id', farcasterProfileId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Contact operations
export const createContact = async (contactData) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contactData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getContactsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId)
    .order('priority_score', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateContactPriority = async (contactId, priorityScore) => {
  const { data, error } = await supabase
    .from('contacts')
    .update({ priority_score: priorityScore })
    .eq('contact_id', contactId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Contact Group operations
export const createContactGroup = async (groupData) => {
  const { data, error } = await supabase
    .from('contact_groups')
    .insert([groupData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getContactGroupsByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('contact_groups')
    .select(`
      *,
      contact_group_members (
        contact_id,
        contacts (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addContactToGroup = async (groupId, contactId) => {
  const { data, error } = await supabase
    .from('contact_group_members')
    .insert([{ group_id: groupId, contact_id: contactId }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const removeContactFromGroup = async (groupId, contactId) => {
  const { error } = await supabase
    .from('contact_group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('contact_id', contactId);
  
  if (error) throw error;
};
