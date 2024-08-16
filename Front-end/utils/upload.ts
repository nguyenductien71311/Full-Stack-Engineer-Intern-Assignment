import axios from 'axios';

export const uploadImageToImgur = async (file: File): Promise<string | null> => {
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  console.log(file);

  if (!clientId) {
    console.error('Imgur Client ID is not set.');
    return null;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', 'image');

  try {
    const response = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return response.data.data.link;
    } else {
      console.error('Failed to upload image to Imgur:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error uploading image to Imgur:', error);
    return null;
  }
};
