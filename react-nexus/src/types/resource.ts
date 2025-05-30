export type ResourceType = 'image' | 'audio' | 'video' | 'sprite' | 'scene' | 'animation' | 'other';

export interface ResourceMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  lastModified: number;
  tags?: string[];
  category?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  url: string;
  size: number;
  mimeType: string;
  metadata: ResourceMetadata;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  version: number;
}

export interface ResourceGroup {
  id: string;
  name: string;
  description?: string;
  resources: Resource[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectExport {
  version: string;
  name: string;
  description?: string;
  resources: Resource[];
  scenes: any[]; // 使用已有的Scene类型
  metadata: {
    createdAt: string;
    updatedAt: string;
    author: string;
    engineVersion: string;
    thumbnail?: string;
  };
  settings: {
    resolution: {
      width: number;
      height: number;
    };
    fps: number;
    backgroundColor: string;
  };
} 