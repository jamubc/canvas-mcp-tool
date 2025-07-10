import { z } from 'zod';
import { CanvasAPIClient } from '../api/canvas-client.js';
import { createLogger } from '../utils/logger.js';
import { FileExtractor } from '../utils/file-extractor.js';

const logger = createLogger('FilesTools');

export const GetFileContentSchema = z.object({
  file_id: z.number(),
  extract_text: z.boolean().optional().default(true),
});

export const GetFileMetadataSchema = z.object({
  file_id: z.number(),
});

export class FilesTools {
  private extractor: FileExtractor;

  constructor(private client: CanvasAPIClient) {
    this.extractor = new FileExtractor();
  }

  async getFileMetadata(params: z.infer<typeof GetFileMetadataSchema>): Promise<any> {
    try {
      logger.info(`Fetching metadata for file ${params.file_id}`);
      
      const fileData = await this.client.getFileMetadata(params.file_id);
      
      return {
        id: fileData.id,
        filename: fileData.filename,
        display_name: fileData.display_name,
        content_type: fileData.content_type,
        size: fileData.size,
        created_at: fileData.created_at,
        updated_at: fileData.updated_at,
        url: fileData.url,
        thumbnail_url: fileData.thumbnail_url,
        preview_url: fileData.preview_url,
        supported_for_extraction: FileExtractor.isSupported(fileData.content_type)
      };
    } catch (error) {
      logger.error(`Failed to get file metadata for ${params.file_id}`, error);
      throw error;
    }
  }

  async getFileContent(params: z.infer<typeof GetFileContentSchema>): Promise<any> {
    try {
      logger.info(`Fetching content for file ${params.file_id}`);
      
      // First get file metadata
      const fileData = await this.client.getFileMetadata(params.file_id);
      
      // Check file size
      if (fileData.size > 10 * 1024 * 1024) {
        return {
          error: 'File too large',
          message: `File size (${(fileData.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`,
          file: {
            id: fileData.id,
            filename: fileData.filename,
            size: fileData.size,
            content_type: fileData.content_type,
            url: fileData.url
          }
        };
      }

      // Determine MIME type from filename if content_type is missing
      let mimeType = fileData.content_type;
      if (!mimeType || mimeType === 'undefined') {
        const ext = fileData.filename.toLowerCase().split('.').pop();
        const mimeTypeMap: Record<string, string> = {
          'pdf': 'application/pdf',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'txt': 'text/plain',
          'md': 'text/markdown',
          'csv': 'text/csv'
        };
        mimeType = mimeTypeMap[ext || ''] || 'unknown';
      }

      // Check if file type is supported
      if (!FileExtractor.isSupported(mimeType)) {
        return {
          error: 'Unsupported file type',
          message: `File type '${mimeType}' is not supported for text extraction`,
          supported_types: [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/markdown',
            'text/csv'
          ],
          file: {
            id: fileData.id,
            filename: fileData.filename,
            content_type: fileData.content_type,
            detected_type: mimeType,
            url: fileData.url
          }
        };
      }

      // Download the file
      logger.info(`Downloading file ${fileData.filename} from ${fileData.url}`);
      
      try {
        // Use axios directly for file download without auth header (uses verifier token in URL)
        const axios = (await import('axios')).default;
        const response = await axios.get(fileData.url, {
          responseType: 'arraybuffer',
          maxContentLength: 10 * 1024 * 1024,
          timeout: 60000
        });
        
        const buffer = Buffer.from(response.data);
        logger.info(`Downloaded ${buffer.length} bytes`);
        
        // Extract content based on the determined MIME type
        const extractor = new FileExtractor();
        const result = await extractor.extractFromBuffer(
          buffer,
          fileData.filename,
          mimeType
        );
        
        return {
          success: true,
          file: {
            id: fileData.id,
            filename: fileData.filename,
            display_name: fileData.display_name,
            size: fileData.size,
            content_type: fileData.content_type,
            detected_type: mimeType,
            url: fileData.url,
            created_at: fileData.created_at
          },
          extraction: result
        };
      } catch (extractError: any) {
        logger.error(`Failed to download/extract file: ${extractError.message}`);
        
        return {
          error: 'Extraction failed',
          message: extractError.message,
          file: {
            id: fileData.id,
            filename: fileData.filename,
            content_type: fileData.content_type,
            detected_type: mimeType,
            url: fileData.url
          }
        };
      }
    } catch (error) {
      logger.error(`Failed to get file content for ${params.file_id}`, error);
      throw error;
    }
  }
}