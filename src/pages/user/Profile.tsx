import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import {
  Container,
  Box,
  Image,
  Button,
  Avatar,
  AvatarBadge,
  VStack,
  Heading,
  Text,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Badge,
  useDisclosure,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  FormControl,
  FormLabel,
  Grid,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useToken from "@/store/zustand";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import useShowToast from "@/hooks/toast";
import { LoaderCircle } from "lucide-react";
import { setUser } from "@/store/features/userSlice";
const Acc = z.object({
  firstName: z.string(),
  lastName: z.string(),
  bio: z.string().max(160),
  Image: z.any().optional(),
  Cover: z.any().optional(),
});

type FormDataSchema = z.infer<typeof Acc>;

const Profile = () => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const toast = useShowToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const profileImage = useRef<HTMLInputElement>(null);
  const { username } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user.user);

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

  const getUserData = async () => {
    return api.get(`/api/v1/auth/profile/${username}`);
  };

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: getUserData,
    placeholderData: undefined,
    staleTime: 6000,
  });

  const user = data?.data.user;

  console.log("userstate", userState?._id, "user", user?._id);

  const formMethods = useForm({
    resolver: zodResolver(Acc),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      Image: user?.profileImg || "",
      Cover: user?.coverImg || "",
    },
  });

  const handleChangeCover = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    const files = event.target.files;
    let selected;
    if (files && files.length > 0) {
      selected = files[0];
    }

    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string); // Set the preview
      };
      reader.readAsDataURL(selected);
      // Store the actual File object
    } else {
      onOpen(); // Handle invalid file type
    }
  };

  const openChooseImage = () => {
    if (profileImage.current) {
      profileImage.current.click();
    }
  };

  const changeProfileImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    const files = event.target.files;
    if (files && files.length > 0) {
      const selected = files[0];

      if (selected && ALLOWED_TYPES.includes(selected.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          if (result !== userProfile) {
            setUserProfile(result);
          }
        };
        reader.readAsDataURL(selected);
      } else {
        onOpen();
      }
    }
  };
  const handleFormSubmit = (values: FormDataSchema) => {
    const submittingValues = new globalThis.FormData();
    submittingValues.append("firstName", values.firstName);
    submittingValues.append("lastName", values.lastName);
    submittingValues.append("bio", values.bio);

    if (profileImage.current?.files?.[0]) {
      submittingValues.append("Image", profileImage.current.files[0]);
    }

    if (inputRef.current?.files?.[0]) {
      submittingValues.append("Cover", inputRef.current.files[0]);
    }

    console.log("values", submittingValues);
    for (const [key, value] of submittingValues.entries()) {
      console.log(key, value);
    }
    try {
      mutation.mutate(submittingValues);
    } catch (error: any) {
      console.error(error);
    }
  };

  const updateUser = async (formData: globalThis.FormData) => {
    return api.patch("/api/v1/auth/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  const mutation = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: updateUser,
    onSuccess: (data) => {
      toast("Success", "Profile updated successfully", "success");
      console.log("Profile updated successfully");
      dispatch(setUser(data?.data?.UpdatedUser));
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || "An error occurred";
      toast("Errror", errorMessage, "error");
      console.error(errorMessage);
    },
  });

  const openChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const dateString = user?.createdAt;
  const date = moment(dateString).format("MMMM Do YYYY");
  const list = [
    {
      id: 1,
      name: "Joined",
      value: date,
      color: "yellow",
    },
    {
      id: 2,
      name: "Followers",
      value: user?.folowers.length,
      color: "green",
    },
    {
      id: 3,
      name: "Followings",
      value: user?.following.length,
      color: "cadet",
    },
  ];

  const tabs = ["Account Settings"];

  return (
    <>
      <div
        className="absolute top-0 z-[-2] h-screen w-screen dark:bg-[#ad3131] dark:bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] 
				dark:bg-[size:20px_20px] bg-[#ffffff] bg-[radial-gradient(#00000033_1px,#ffffff_1px)] bg-[size:20px_20px]"
        aria-hidden="true"
      />
      <Box h={40} overflow="hidden">
        <Image
          w="full"
          h="full"
          className="mb-2"
          objectFit="cover"
          src={coverImage || user?.coverImg || "/cover.png"}
          alt={user?.coverImg ? "Cover Image" : ""}
        />
        {userState?._id === user?._id ? (
          <Button
            onClick={openChooseFile}
            position="absolute"
            top={4}
            right={4}
            className="bg-bgBluchp"
          >
            <svg width="1.2em" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                className="text-bold text-black"
              />
            </svg>
            <Text ml={2}>Change Cover</Text>
            <input
              ref={inputRef}
              type="file"
              onChange={handleChangeCover}
              hidden
            />
          </Button>
        ) : null}
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
      </Box>
      <Container display={{ base: "block", md: "flex" }} maxW="container.xl">
        <Box
          as="aside"
          flex={1}
          mr={{ base: 0, md: 5 }}
          mb={{ base: 5, md: 0 }}
          bg="white"
          rounded="md"
          borderWidth={1}
          borderColor="brand.light"
          style={{ transform: "translateY(-100px)" }}
        >
          <VStack
            spacing={3}
            py={5}
            borderBottomWidth={1}
            borderColor="brand.light"
          >
            <Avatar
              size="2xl"
              name="Tim Cook"
              cursor="pointer"
              onClick={openChooseImage}
              src={userProfile ? userProfile : user?.profileImg}
            >
              {userState?._id === user?._id ? (
                <AvatarBadge bg="brand.blue" boxSize="1em">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    width="24"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="#1e3071"
                      d="M220.6 121.2L271.1 96 448 96l0 96-114.8 0c-21.9-15.1-48.5-24-77.2-24s-55.2 8.9-77.2 24L64 192l0-64 128 0c9.9 0 19.7-2.3 28.6-6.8zM0 128L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L271.1 32c-9.9 0-19.7 2.3-28.6 6.8L192 64l-32 0 0-16c0-8.8-7.2-16-16-16L80 32c-8.8 0-16 7.2-16 16l0 16C28.7 64 0 92.7 0 128zM168 304a88 88 0 1 1 176 0 88 88 0 1 1 -176 0z"
                    />
                  </svg>
                </AvatarBadge>
              ) : null}
            </Avatar>
            {userState?._id === user?._id ? (
              <input
                hidden
                type="file"
                ref={profileImage}
                onChange={changeProfileImage}
              />
            ) : null}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>
                  <span className="text-red-500">Invalid Format</span>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>File not supported!</Text>
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
                  <Button onClick={onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <VStack spacing={1}>
              <Heading as="h3" fontSize="xl" color="brand.dark">
                {user?.username}
              </Heading>
              <Text color="brand.gray" fontSize="sm">
                {user?.bio}
              </Text>
            </VStack>
          </VStack>
          <VStack as="ul" spacing={0} listStyleType="none">
            {list.map((item) => (
              <Box
                key={item.id}
                as="li"
                w="full"
                py={3}
                display="flex"
                px={5}
                alignItems="center"
                justifyContent="space-between"
                borderBottomWidth={1}
                borderColor="brand.light"
              >
                <Badge>{item.name}</Badge>

                {/* <Text color="brand.dark">{item.name}</Text> */}
                <Text color={`brand.${item.color}`} fontWeight="bold">
                  {item.value}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
        {userState?._id === user?._id ? (
          <Box
            as="main"
            flex={3}
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            pt={5}
            bg="white"
            mt={4}
            rounded="md"
            borderWidth={1}
            borderColor="gray.200"
            style={{ transform: "translateY(-100px)" }}
          >
            <Tabs>
              <TabList px={5}>
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    mx={3}
                    px={0}
                    py={3}
                    fontWeight="semibold"
                    color="brand.cadet"
                    borderBottomWidth={1}
                    _active={{ bg: "transparent" }}
                    _selected={{
                      color: "brand.dark",
                      borderColor: "brand.blue",
                    }}
                  >
                    {tab}
                  </Tab>
                ))}
              </TabList>

              <TabPanels px={3} mt={5}>
                <TabPanel>
                  <FormProvider {...formMethods}>
                    <form onSubmit={formMethods.handleSubmit(handleFormSubmit)}>
                      <Grid
                        templateColumns={{
                          base: "repeat(1, 1fr)",
                          md: "repeat(2, 1fr)",
                        }}
                        gap={6}
                      >
                        <Controller
                          name="firstName"
                          control={formMethods.control}
                          render={({ field, fieldState }) => (
                            <FormControl isInvalid={fieldState.invalid}>
                              <FormLabel>First Name</FormLabel>
                              <Input {...field} placeholder={user?.firstName} />
                              <FormErrorMessage>
                                {fieldState.error?.message}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        />
                        <Controller
                          name="lastName"
                          control={formMethods.control}
                          render={({ field, fieldState }) => (
                            <FormControl isInvalid={fieldState.invalid}>
                              <FormLabel>Last Name</FormLabel>
                              <Input {...field} placeholder={user?.lastName} />
                              <FormErrorMessage>
                                {fieldState.error?.message}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        />
                      </Grid>
                      <div className="flex">
                        <Controller
                          name="bio"
                          control={formMethods.control}
                          render={({ field, fieldState }) => (
                            <FormControl isInvalid={fieldState.invalid}>
                              <FormLabel>Bio</FormLabel>
                              <Input {...field} placeholder={user?.bio} />
                              <FormErrorMessage>
                                {fieldState.error?.message}
                              </FormErrorMessage>
                            </FormControl>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-bgBluchp mt-4"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? (
                          <LoaderCircle size={20} className="animate-spin" />
                        ) : (
                          ""
                        )}
                        <span className="ml-2">Update</span>
                      </Button>
                      <Button
                        className="w-full bg-bgBluchp mt-4"
                        onClick={() => navigate("/dashboard/home")}
                      >
                        <span className="ml-2">Cancel</span>
                      </Button>
                    </form>
                  </FormProvider>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        ) : null}
      </Container>
    </>
  );
};

export default Profile;
