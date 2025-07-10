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

      // Check if file type is supported
      if (!FileExtractor.isSupported(fileData.content_type)) {
        return {
          error: 'Unsupported file type',
          message: `File type '${fileData.content_type}' is not supported for text extraction`,
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
            url: fileData.url
          }
        };
      }

      // For now, return a message about downloading directly
      // In a full implementation, we would download and extract here
      return {
        status: 'not_implemented',
        message: 'File content extraction is not yet implemented. Please download the file directly from Canvas.',
        file: {
          id: fileData.id,
          filename: fileData.filename,
          display_name: fileData.display_name,
          size: fileData.size,
          content_type: fileData.content_type,
          url: fileData.url,
          created_at: fileData.created_at
        },
        implementation_notes: {
          next_steps: 'Install pdf-parse for PDFs and mammoth/officeparser for DOCX files',
          security: 'Files are processed in memory only, never saved to disk',
          size_limit: '10MB maximum file size for extraction'
        }
      };
    } catch (error) {
      logger.error(`Failed to get file content for ${params.file_id}`, error);
      throw error;
    }
  }
}