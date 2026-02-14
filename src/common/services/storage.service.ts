import { Injectable, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
    private supabase: SupabaseClient;
    private bucketName = 'uploads'; // Nombre del bucket en Supabase Storage
    private readonly logger = new Logger(StorageService.name);
    private readonly localUploadPath = path.join(process.cwd(), 'uploads');

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!fs.existsSync(this.localUploadPath)) {
            fs.mkdirSync(this.localUploadPath, { recursive: true });
        }

        if (!supabaseUrl || !supabaseKey) {
            this.logger.warn('⚠️  SUPABASE_URL and SUPABASE_ANON_KEY are not defined. Using local storage as fallback.');
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileExtension = file.originalname.split('.').pop() || 'tmp';
        const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`;
        const relativePath = `uploads/${fileName}`;

        // Fallback to local storage if Supabase is not initialized
        if (!this.supabase) {
            const fullPath = path.join(this.localUploadPath, folder);
            if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

            const filePath = path.join(this.localUploadPath, fileName);
            fs.writeFileSync(filePath, file.buffer);
            this.logger.log(`File saved locally: ${relativePath}`);
            return `/${relativePath}`;
        }

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            this.logger.error(`Error uploading to Supabase: ${error.message}. Falling back to local.`);
            return this.saveLocally(file.buffer, folder, fileName);
        }

        const { data: publicUrlData } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }

    async uploadBase64(base64Str: string, folder: string): Promise<string | null> {
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) return null;

        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const extension = contentType.split('/')[1] || 'png';

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `${folder}/${timestamp}-${randomString}.${extension}`;
        const relativePath = `uploads/${fileName}`;

        if (!this.supabase) {
            const fullPath = path.join(this.localUploadPath, folder);
            if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

            const filePath = path.join(this.localUploadPath, fileName);
            fs.writeFileSync(filePath, buffer);
            return `/${relativePath}`;
        }

        const { data, error } = await this.supabase.storage
            .from(this.bucketName)
            .upload(fileName, buffer, {
                contentType: contentType,
                upsert: false,
            });

        if (error) {
            this.logger.error(`Error uploading base64 to Supabase: ${error.message}. Falling back to local.`);
            return this.saveLocally(buffer, folder, fileName);
        }

        const { data: publicUrlData } = this.supabase.storage
            .from(this.bucketName)
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    }

    private saveLocally(buffer: Buffer, folder: string, fileName: string): string {
        const fullPath = path.join(this.localUploadPath, folder);
        if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

        const filePath = path.join(this.localUploadPath, fileName);
        fs.writeFileSync(filePath, buffer);
        return `/uploads/${fileName}`;
    }
}
