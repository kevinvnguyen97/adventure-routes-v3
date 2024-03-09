import { SECRETS } from "/imports/constants";

type ImgBBUploadResponse = {
  data?: {
    delete_url: string;
    display_url: string;
    expiration: number;
    height: number;
    id: string;
    image: {
      extension: string;
      filename: string;
      mime: string;
      name: string;
      url: string;
    };
    medium: {
      extension: string;
      filename: string;
      mime: string;
      name: string;
      url: string;
    };
    size: number;
    thumb: {
      extension: string;
      filename: string;
      mime: string;
      name: string;
      url: string;
    };
    time: number;
    title: string;
    url: string;
    url_viewer: string;
    width: number;
  };
  status: number;
  success: boolean;
};

export const uploadToImgBB = async (
  file: File,
  name: string
): Promise<ImgBBUploadResponse> => {
  const uploadImageFormData = new FormData();

  uploadImageFormData.append("image", file);
  uploadImageFormData.append("name", name);
  const uploadImage = await fetch(
    `https://api.imgbb.com/1/upload?key=${SECRETS.public.oauth.imgBBApiKey}`,
    {
      method: "POST",
      body: uploadImageFormData,
    }
  );
  const uploadResponse = (await uploadImage.json()) as ImgBBUploadResponse;
  return uploadResponse;
};
