import PostForm from "@/components/ui/forms/Postforms";
import { ImagePlus } from "lucide-react";

const CreatePost = () => {
  return (
    <div className="flex flex-1 bg-bgBluchp dark:bg-none">
      <div className=" flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14 custom-scrollbar">
        <div className="max-w-5xl flex gap-3 justify-between items-center w-full">
          <ImagePlus size={40} className="text-bluchp" />
          <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:h2-bold text-left w-full text-bluchp">
            Create Post
          </h2>
        </div>

        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
