export interface FileExtractionResult {
    content: string;
    structured_content?: {
        sections?: Array<{
            title?: string;
            content: string;
            page?: number;
            type: 'heading' | 'paragraph' | 'list' | 'table' | 'image' | 'caption';
        }>;
        images?: Array<{
            page: number;
            caption?: string;
            alt_text?: string;
            description?: string;
            base64?: string;
        }>;
        tables?: Array<{
            page: number;
            headers?: string[];
            rows: string[][];
            caption?: string;
        }>;
        metadata?: {
            title?: string;
            author?: string;
            subject?: string;
            keywords?: string[];
            created?: string;
            modified?: string;
        };
    };
    metadata: {
        filename: string;
        size: number;
        type: string;
        pages?: number;
        extractedAt: string;
        extraction_method: 'basic' | 'structured' | 'ocr';
        has_images?: boolean;
        has_tables?: boolean;
        has_forms?: boolean;
    };
}
export declare class FileExtractor {
    extractFromUrl(url: string, headers?: Record<string, string>): Promise<FileExtractionResult>;
    extractFromBuffer(buffer: Buffer, filename: string, mimeType: string): Promise<FileExtractionResult>;
    private extractPDF;
    private extractDOCX;
    static isSupported(mimeType: string): boolean;
}
//# sourceMappingURL=file-extractor.d.ts.map