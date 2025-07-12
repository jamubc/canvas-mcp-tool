/**
 * Simple Canvas API client wrapper
 * Following KISS principle - minimal abstraction over axios
 */

import axios, { AxiosInstance } from 'axios';

export class CanvasClient {
  private api: AxiosInstance;
  
  get: AxiosInstance['get'];
  post: AxiosInstance['post'];
  put: AxiosInstance['put'];
  delete: AxiosInstance['delete'];

  constructor(domain: string, token: string) {
    this.api = axios.create({
      baseURL: `https://${domain}/api/v1`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Bind methods after api is initialized
    this.get = this.api.get.bind(this.api);
    this.post = this.api.post.bind(this.api);
    this.put = this.api.put.bind(this.api);
    this.delete = this.api.delete.bind(this.api);
  }
}