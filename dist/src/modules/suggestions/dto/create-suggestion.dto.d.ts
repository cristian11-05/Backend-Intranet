import { SuggestionType } from '@prisma/client';
export declare class CreateSuggestionDto {
    tipo: SuggestionType;
    titulo: string;
    descripcion: string;
    adjunto_url?: string;
}
