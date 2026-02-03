import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
    private supabase: SupabaseClient;
    private bucketName = 'uploads'; // Nombre del bucket en Supabase Storage

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be defined in .env');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    /**
     * Sube un archivo a Supabase Storage y retorna la URL pública
     * @param file - El archivo de Multer (con buffer en memoria)
     * @param folder - Carpeta dentro del bucket (ej: 'justifications', 'suggestions')
     * @returns URL pública del archivo
     */
    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new Error(`Error uploading file to Supabase: ${error.message}`);
        }

        // Obtener la URL pública
        const { data: publicUrlData } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }
}
