import { z } from 'zod';
import { CanvasAPIClient } from '../api/canvas-client.js';
export declare const GetFileContentSchema: z.ZodObject<{
    file_id: z.ZodNumber;
    extract_text: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    file_id: number;
    extract_text: boolean;
}, {
    file_id: number;
    extract_text?: boolean | undefined;
}>;
export declare const GetFileMetadataSchema: z.ZodObject<{
    file_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    file_id: number;
}, {
    file_id: number;
}>;
export declare class FilesTools {
    private client;
    private extractor;
    constructor(client: CanvasAPIClient);
    getFileMetadata(params: z.infer<typeof GetFileMetadataSchema>): Promise<any>;
    getFileContent(params: z.infer<typeof GetFileContentSchema>): Promise<any>;
}
//# sourceMappingURL=files.d.ts.map