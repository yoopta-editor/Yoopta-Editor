import { uploadToCloudinary } from '@/utils/cloudinary';
import { YooptaContentValue } from '@yoopta/editor';
import YooptaStarterKit from '@yoopta/starter-kit';
import { useRef, useState } from 'react';

const WithStarterKit = () => {
  const [value, setValue] = useState<YooptaContentValue>();
  const selectionRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={selectionRef}
      className="md:py-[100px] md:pl-[200px] md:pr-[80px] px-[20px] pt-[80px] pb-[40px] flex justify-center">
      <YooptaStarterKit
        id="starter-kit"
        value={value}
        onChange={(data) => setValue(data)}
        style={{ width: 650 }}
        selectionRef={selectionRef}
        placeholder="Start typing here..."
        media={{
          imageUpload: async (file) => {
            const data = await uploadToCloudinary(file, 'image');

            return {
              src: data.secure_url,
              alt: 'cloudinary',
              sizes: {
                width: data.width,
                height: data.height,
              },
            };
          },
          fileUpload: async (file) => {
            const response = await uploadToCloudinary(file, 'auto');
            return { src: response.url, name: response.name };
          },
          videoUpload: async (file) => {
            const data = await uploadToCloudinary(file, 'video');
            return {
              src: data.secure_url,
              alt: 'cloudinary',
              sizes: {
                width: data.width,
                height: data.height,
              },
            };
          },
        }}
      />
    </div>
  );
};

export default WithStarterKit;
