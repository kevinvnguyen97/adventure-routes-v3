export const uploadToImgBB = async (
  imageUrl: string,
  name: string
): Promise<void> => {
  const uploadImageFormData = new FormData();
  uploadImageFormData.append("key", "key");
  uploadImageFormData.append("image", imageUrl);
  uploadImageFormData.append("name", name);
  const uploadImage = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: uploadImageFormData,
  });

  console.log(uploadImage);
};
