export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  original_filename: string;
  format?: string;
  bytes: number;
  created_at: string;
  roomId?: string;
  custom_id?: string | null;
}

export interface TextMessage {
  id: string;
  content: string;
  created_at: string;
}
