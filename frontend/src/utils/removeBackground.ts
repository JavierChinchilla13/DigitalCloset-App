import axios from 'axios';

const REMOVE_BG_API_KEY = import.meta.env.VITE_REMOVE_BG_API_KEY;

export const removeBackground = async (file: File): Promise<Blob> => {
  if (!REMOVE_BG_API_KEY) {
    throw new Error('Remove.bg API key is not configured.');
  }

  const formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', file);

  try {
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      responseType: 'blob',
    });

    if (response.status !== 200) {
      throw new Error(`Error from Remove.bg: ${response.statusText}`);
    }

    return response.data as Blob;
  } catch (error: unknown) {
    console.error('Background removal failed:', error);
    if (axios.isAxiosError(error) && error.response?.data) {
      throw new Error('Failed to remove background. Please check your API key and quota.', { cause: error });
    }
    throw error instanceof Error ? error : new Error('Unknown error during background removal');
  }
};
