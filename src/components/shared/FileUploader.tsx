import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

const convertFileToUrl = (file: File) => URL.createObjectURL(file);
type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

//   const files = event.target.files;
//   let selected;
//   if (files && files.length > 0) {
//     selected = files[0];
//   }

//   if (selected && ALLOWED_TYPES.includes(selected.type)) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       setuserPosts(reader.result as string); // Set the preview
//     };
//     reader.readAsDataURL(selected);
//     // Store the actual File object
//   } else {
//     onOpen(); // Handle invalid file type
//   }
// };
const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const [isVideo, setIsVideo] = useState<boolean>(false);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
      setIsVideo(acceptedFiles[0].type.startsWith("video"));
    },

    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer border-dashed border-opacity-30 border-white border-2"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center items-center w-full p-5 lg:p-10">
            {isVideo ? (
              <video
                src={fileUrl}
                controls
                className="h-80 lg:h-[480px] w-full rounded-[24px] object-cover"
              />
            ) : (
              <img
                src={fileUrl}
                alt="file preview"
                className="h-80 lg:h-[480px] w-full rounded-[24px] object-cover"
              />
            )}
          </div>
          <p className="text-light-4 text-center small-regular w-full text-bluchp p-4 border-t font-mono">
            Click or drag photo to replace
          </p>
        </>
      ) : (
        <div className="flex-center items-center justify-center flex-col p-7 h-80 lg:h-[450px] ">
          <div className="flex items-center justify-center">
            <img
              src="/file-upload.svg"
              width={420}
              height={77}
              alt="file upload"
            />
          </div>
          <div className=" flex flex-row items-center justify-center gap-12 mt-8">
            <h3 className="text-light-4 small-regular  font-mono text-white">
              SVG, PNG, JPG, Mp4
            </h3>
            <h3 className="text-light small-regular font-mono text-white">
              Select or Drag n Drop File
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
