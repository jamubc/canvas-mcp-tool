// Testing Suite


import { describe, it, expect, vi } from 'vitest'
// Mock axios to test CanvasClient configuration and method bindings
vi.mock('axios', () => {
  const mockGet = vi.fn();
  const mockPost = vi.fn();
  const mockPut = vi.fn();
  const mockDelete = vi.fn();
  return {
    default: {
      create: vi.fn(() => ({
        get: mockGet,
        post: mockPost,
        put: mockPut,
        delete: mockDelete,
      })),
    },
  };
});
import axios from 'axios';
import { CanvasClient } from './canvas-client.js';

describe('CanvasClient', () => {
  it('should initialize axios instance with correct config and bind methods', () => {
    const domain = 'example-domain.com';
    const token = 'example-token';
    const client = new CanvasClient(domain, token);

    const axiosCreateMock = axios.create as any;
    expect(axiosCreateMock).toHaveBeenCalledWith({
      baseURL: `https://${domain}/api/v1`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Verify that methods are bound to the axios instance by calling them
    const instance = axiosCreateMock.mock.results[0].value as any;
    const { get: mockGet, post: mockPost, put: mockPut, delete: mockDelete } = instance;

    // Test get method
    client.get('/test-get');
    expect(mockGet).toHaveBeenCalledWith('/test-get');

    // Test post method
    client.post('/test-post', { foo: 'bar' });
    expect(mockPost).toHaveBeenCalledWith('/test-post', { foo: 'bar' });

    // Test put method
    client.put('/test-put', { x: 1 });
    expect(mockPut).toHaveBeenCalledWith('/test-put', { x: 1 });

    // Test delete method
    client.delete('/test-delete');
    expect(mockDelete).toHaveBeenCalledWith('/test-delete');
  });
});