export interface UserMetadata {
    full_name?: string;
    avatar_url?: string;
  }
  
  export interface UserProfile {
    id?: string;
    email?: string;
    phone?: string;
    created_at?: string;
    user_metadata?: UserMetadata;
  }
  