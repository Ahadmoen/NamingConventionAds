export interface FieldDefinition {
  id: string;
  field_name: string;
  display_name: string;
  format?: string;
  required: boolean;
  description?: string;
  example?: string;
  field_order: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface NamingConvention {
  id: string;
  user_id: string;
  name: string;
  convention_values: Record<string, string>;
  separator: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormValues {
  [key: string]: string;
}
