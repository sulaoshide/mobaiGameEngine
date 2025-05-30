import JSZip from 'jszip';
import { Resource, ProjectExport, ResourceMetadata } from '../types/resource';

export const generateResourceId = (): string => {
  return `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getFileType = (file: File): string => {
  const mimeType = file.type;
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('video/')) return 'video';
  return 'other';
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = reject;
    audio.src = URL.createObjectURL(file);
  });
};

export const createResourceFromFile = async (file: File): Promise<Resource> => {
  const url = URL.createObjectURL(file);
  const type = getFileType(file);
  const metadata: ResourceMetadata = {
    lastModified: file.lastModified,
    format: file.type.split('/')[1],
    tags: [],
    category: '未分类'
  };

  // 获取特定类型资源的额外元数据
  if (type === 'image') {
    const dimensions = await getImageDimensions(file);
    metadata.width = dimensions.width;
    metadata.height = dimensions.height;
  } else if (type === 'audio') {
    metadata.duration = await getAudioDuration(file);
  }

  const resource: Resource = {
    id: generateResourceId(),
    name: file.name,
    type: type as any,
    url,
    size: file.size,
    mimeType: file.type,
    metadata,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    version: 1
  };

  // 保存到 IndexedDB
  await saveResourceToIndexedDB(resource, file);

  return resource;
};

export const exportProject = async (
  projectData: ProjectExport,
  resources: Resource[]
): Promise<Blob> => {
  const zip = new JSZip();

  // 添加项目数据
  zip.file('project.json', JSON.stringify(projectData, null, 2));

  // 添加资源文件
  const resourcesFolder = zip.folder('resources');
  if (resourcesFolder) {
    for (const resource of resources) {
      try {
        const response = await fetch(resource.url);
        if (!response.ok) throw new Error(`Failed to fetch resource: ${resource.name}`);
        const blob = await response.blob();
        resourcesFolder.file(resource.name, blob);
      } catch (error) {
        console.error(`Failed to export resource: ${resource.name}`, error);
        // 继续处理其他资源，而不是中断整个导出过程
      }
    }
  }

  // 添加项目缩略图
  if (projectData.metadata.thumbnail) {
    try {
      const response = await fetch(projectData.metadata.thumbnail);
      if (response.ok) {
        const blob = await response.blob();
        zip.file('thumbnail.png', blob);
      }
    } catch (error) {
      console.error('Failed to export thumbnail', error);
    }
  }

  return await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 9
    }
  });
};

export const importProject = async (file: File): Promise<ProjectExport> => {
  try {
    const zip = await JSZip.loadAsync(file);
    const projectData = await zip.file('project.json')?.async('string');
    
    if (!projectData) {
      throw new Error('Invalid project file: project.json not found');
    }

    const project = JSON.parse(projectData);

    // 验证项目数据格式
    if (!project.version || !project.name || !project.resources || !project.scenes) {
      throw new Error('Invalid project data format');
    }

    return project;
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const validateResource = (resource: Resource): boolean => {
  return !!(
    resource.id &&
    resource.name &&
    resource.type &&
    resource.url &&
    resource.size &&
    resource.mimeType &&
    resource.metadata &&
    resource.createdAt &&
    resource.updatedAt
  );
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// 本地存储相关的工具函数
export const saveResourcesToLocalStorage = (resources: Resource[]): void => {
  try {
    // 将资源数据转换为可存储的格式
    const resourcesData = resources.map(resource => ({
      ...resource,
      // 将 Blob URL 转换为 Base64
      url: resource.url.startsWith('blob:') ? null : resource.url
    }));
    localStorage.setItem('project_resources', JSON.stringify(resourcesData));
  } catch (error) {
    console.error('Failed to save resources to localStorage:', error);
  }
};

export const loadResourcesFromLocalStorage = async (): Promise<Resource[]> => {
  try {
    const resourcesData = localStorage.getItem('project_resources');
    if (!resourcesData) return [];

    const resources = JSON.parse(resourcesData) as Resource[];
    
    // 恢复 Blob URL
    const restoredResources = await Promise.all(
      resources.map(async resource => {
        if (!resource.url) {
          // 如果 URL 为空，尝试从 IndexedDB 恢复
          const blob = await getResourceBlobFromIndexedDB(resource.id);
          if (blob) {
            resource.url = URL.createObjectURL(blob);
          }
        }
        return resource;
      })
    );

    return restoredResources;
  } catch (error) {
    console.error('Failed to load resources from localStorage:', error);
    return [];
  }
};

// IndexedDB 相关函数
const DB_NAME = 'resource_manager_db';
const STORE_NAME = 'resources';
const DB_VERSION = 1;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const saveResourceToIndexedDB = async (resource: Resource, blob: Blob): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.put(blob, resource.id);
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save resource to IndexedDB:', error);
  }
};

export const getResourceBlobFromIndexedDB = async (resourceId: string): Promise<Blob | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return await new Promise((resolve, reject) => {
      const request = store.get(resourceId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get resource from IndexedDB:', error);
    return null;
  }
};

export const deleteResourceFromIndexedDB = async (resourceId: string): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise((resolve, reject) => {
      const request = store.delete(resourceId);
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to delete resource from IndexedDB:', error);
  }
}; 