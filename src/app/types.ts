export interface CloudinaryResource {
    public_id: string;
    secure_url: string;
    original_filename: string;
    format?: string; // Add this if not already present
    bytes: number;
    created_at: string;
    roomId?: string;
    custom_id?: string | null;
  }