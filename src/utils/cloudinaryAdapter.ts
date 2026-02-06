import { getDatePath } from './imageUrl'; // <-- Import the helper


export class CloudinaryUploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  async upload() {
    const file = await this.loader.file;
    const formData = new FormData();
    formData.append('file', file);
    
     // --- CHANGE THIS to your new preset name ---
    formData.append('upload_preset', 'blog_unsigned_preset');
    
    // --- UPDATED: Use dynamic date pathing ---
    formData.append('folder', getDatePath('uploads')); 

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/daoqvaxeq/image/upload`,
      { method: 'POST', body: formData }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    return {
      default: data.secure_url // The URL injected into the editor
    };
  }
}

export function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new CloudinaryUploadAdapter(loader);
  };
}