import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shcooyxijqbrsuxpknnj.supabase.co';
const supabaseAnonKey = 'sb_publishable_vlQNF02EakkQaydjam5E7A_zinuI-DV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
