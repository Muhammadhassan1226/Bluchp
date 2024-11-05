import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Post } from "@/types/Posts";
import useToken from "@/store/zustand";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Badge,
  Text,
  ModalCloseButton,
  ModalBody,
  HStack,
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import useShowToast from "@/hooks/realtoast";
import FileUploader from "@/components/shared/FileUploader";
import { useAppSelector } from "@/store/store";
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

api.interceptors.request.use((config) => {
  const token = useToken.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PostValidation = z.object({
  caption: z
    .string()
    .max(2200, { message: "Maximum 2,200 characters" })
    .optional(),
  file: z.any().optional(),
});

const createPostsfn = async (data: globalThis.FormData) => {
  return api.post("/api/v1/posts/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

type PostFormProps = {
  post?: Post | null;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const { isOpen, onClose } = useDisclosure();
  const { showToast, dismissToast } = useShowToast();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: "",
      file: [],
    },
  });

  if (!user) {
    navigate("/dashboard/home", { replace: true });
  }

  const mutation = useMutation({
    mutationKey: ["createPosts"],
    mutationFn: createPostsfn,
    onMutate: () => {
      showToast(
        "Uploading...",
        "Please Wait its takes a while",
        "loading",
        null
      );
    },
    onSuccess: (data) => {
      console.log("data", data);
      dismissToast();
      showToast("Post Created", "Post created successfully", "success");
      navigate(-1);
      // Handle success
    },
    onError: (err: any) => {
      dismissToast();
      const errorMessage = err?.response?.data?.error || "An error occurred";
      showToast("Error", errorMessage, "error");
      console.error(errorMessage);
    },
  });

  const handleSubmit = async (values: z.infer<typeof PostValidation>) => {
    const submittingValues = new FormData();
    submittingValues.append("text", values.caption);

    submittingValues.append("file", values.file[0]);
    console.log(submittingValues);
    try {
      mutation.mutate(submittingValues);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full justify-center max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="h-36 bg-dark-3 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* <div className="flex-center flex-col p-7 h-80 lg:h-[450px]">
          <div className="flex items-center justify-center">
            {userposts ? (
              <img
                src={userposts}
                className="w-72 h-72 rounded-xl"
                alt="User post"
              />
            ) : (
              <img
                src="/file-upload.svg"
                className="w-72"
                width={96}
                height={77}
                alt="File upload"
              />
            )}
          </div>
          <p className="text-light-4 text-white small-regular mb-6 font-mono">
            SVG, PNG, JPG
          </p>
          <div className="flex items-center justify-center">
            <Button onClick={openChooseImage}>
              <Input
                type="file"
                className="w-full text-bgBluchp"
                ref={ImageRef}
                onChange={handleImageChange}
              />
            </Button>
          </div>
        </div> */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={""} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Badge colorScheme="red">Invalid Format</Badge>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text color="brand.red">File not supported!</Text>
              <HStack mt={1}>
                <Text color="brand.cadet" fontSize="sm">
                  Supported types:
                </Text>
                <Badge colorScheme="green">PNG</Badge>
                <Badge colorScheme="green">JPG</Badge>
                <Badge colorScheme="green">JPEG</Badge>
              </HStack>
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onClose}
                variant="destructive"
                className="bg-red-500 "
              >
                <span className="text-bold text-white">Close</span>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <div className="flex gap-4 items-center justify-end ">
          <Button
            type="button"
            className="h-8 bg-bluchp px-5 text-light-1 flex gap-2 font-bold hover:bg-gray-200"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="whitespace-nowrap"
            disabled={mutation.isPending}
          >
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
