import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { Arrow } from "@/hooks/arrow";
import useToken from "@/store/zustand";
import {
  Box,
  Heading,
  Container,
  Text,
  Button as BTN,
  Stack,
  Icon,
} from "@chakra-ui/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import "tailwindcss/tailwind.css";
import "./custom.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useGoogleLogin } from "@react-oauth/google";

import { useMutation } from "@tanstack/react-query";
import { LoginFn } from "@/http/auth";
import useShowToast from "@/hooks/toast";
import { LoaderCircle } from "lucide-react";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import axios from "axios";
import { useDate } from "@/store/zustand";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/features/userSlice";
import { setgUser } from "@/store/features/GoogleUserSlice";

const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Minimum 6 Characters" })
    .max(15, { message: "Maximum 15 Characters" }),
});

export function Login() {
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  const toast = useShowToast();
  const setToken = useToken((state) => state.setToken);
  const setDate = useDate((state) => state.setCreateddate);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (user) {
    navigate("/dashboard/home", { replace: true });
  }

  const dispatch = useAppDispatch();

  const login = useGoogleLogin({
    onSuccess: async (resp) => {
      form.reset();
      try {
        const response = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${resp.access_token}`,
            },
          }
        );
        const googleUserData = response.data;
        console.log(response.data);
        dispatch(setgUser(googleUserData));
        // setGoogleUser(response.data);

        const Googleuserregister = await axios.post(
          import.meta.env.VITE_SIGNIN_URL,
          {
            email: googleUserData.email,
            password: "Docker@12345",
          }
        );

        const backendUserData = Googleuserregister.data.user;
        import.meta.env.VITE_NODE_ENV === "development"
          ? console.log("Backend User Data:", backendUserData)
          : "";
        dispatch(setUser(backendUserData));
        navigate("/dashboard/home", { replace: true });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: LoginFn,
    onSuccess: (data) => {
      navigate("/dashboard/home", { replace: true });
      const userData = data?.data?.user;
      setToken(data?.data?.access_token);
      setDate(data?.data?.createdAt);

      if (userData) {
        dispatch(setUser(userData));
        navigate("/dashboard/home", { replace: true });
        if (import.meta.env.VITE_NODE_ENV === "development") {
          console.log(data.data);
        }
      }
    },
    onError: (err: any) => {
      // TypeScript requirement
      import.meta.env.VITE_NODE_ENV === "development" ? console.log(err) : "";
      const errorMessage = err?.response?.data?.error || "An error occurred";
      toast("Error", errorMessage, "error");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      mutation.mutate(values);
    } catch (error) {
      console.log(error);
    }

    import.meta.env.VITE_NODE_ENV === "development" ? console.log(values) : "";
  }

  return (
    <Form {...form}>
      <div className="w-full lg:grid lg:min-h-[400px] lg:grid-cols-2 xl:min-h-[800px] bg-bluchp">
        <div className="flex items-center justify-center ">
          <div className="mt-0 grid w-[350px] gap-6 ">
            <img src="/logo.png" alt="logo" className="w-20 h-21  mx-auto" />
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold text-bgBluchp">Login</h1>
              <p className="text-balance text-bgBluchp">
                Enter required fields to login an account
              </p>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            className="w-full border-black"
                            {...field}
                            placeholder="example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Password</FormLabel>
                          <Link
                            to="/auth/email_verify"
                            className="ml-auto inline-block text-sm underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="w-full border-black dark:text-bluchp "
                              {...field}
                            />
                            <div
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-lg leading-5 cursor-pointer"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <IoEyeOff /> : <IoEye />}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items center ">
                  <Button
                    type="submit"
                    className="w-full bg-bgBluchp"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <LoaderCircle size={20} className="animate-spin" />
                    ) : (
                      ""
                    )}
                    <span className="ml-2">Take me in</span>
                  </Button>
                </div>
              </div>
            </form>
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                className="w-full bg-white text-bgBluchp hover:bg-bluchp"
                onClick={() => login()}
              >
                <FcGoogle size={20} />
                <span className="ml-2">Log in with Google</span>
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              New to Platform?{" "}
              <Link to="/auth/register" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden bg-bgBluchp lg:block">
          <Container maxW={"3xl"}>
            <Stack
              as={Box}
              textAlign={"center"}
              spacing={{ base: 8, md: 14 }}
              py={{ base: 20, md: 36 }}
            >
              <Heading
                fontWeight={400}
                fontSize={{ base: "2xl", sm: "4xl", md: "5xl" }}
                lineHeight={"110%"}
              >
                <span className="ticker" style={{ top: "1%" }}>
                  AAPL ↑ 1.5%
                </span>
                <span className="ticker" style={{ top: "1%", right: "3%" }}>
                  TSLA ↑ .3%2
                </span>
                <span className="ticker" style={{ top: "10%", right: "3%" }}>
                  GOOGL ↑ 1.8%
                </span>
                <span className="ticker" style={{ top: "10%", right: "25%" }}>
                  AMZN ↑ 2.0%
                </span>
                <span className="text-bluchp font-serif font-normal font">
                  Welcome
                </span>{" "}
                <br />
                <Text as={"span"} color={"green.400"}>
                  Back
                </Text>
              </Heading>
              <Text>
                <span className="text-bluchp">
                  Offer exclusive benefits to your loyal readers by granting
                  them early access to stock analysis, pre-release market
                  insights, and sneak-peaks of upcoming investment strategies.
                </span>
                <span className="ticker" style={{ top: "50%", right: "3%" }}>
                  NFLX ↑ 2.5%
                </span>
                <span className="ticker" style={{ top: "50%", right: "32%" }}>
                  NVDA ↑ 2.1
                </span>
                <span className="ticker" style={{ top: "60%", right: "35%" }}>
                  NVDA ↑ 2.1
                </span>
                <span className="ticker" style={{ top: "33%", right: "32%" }}>
                  JPM ↑ 1.3%
                </span>
              </Text>
              <Stack
                direction={"column"}
                spacing={3}
                align={"center"}
                alignSelf={"center"}
                position={"relative"}
              >
                <BTN
                  colorScheme={"green"}
                  bg={"green.400"}
                  rounded={"full"}
                  px={6}
                  mt={6}
                  _hover={{
                    bg: "green.500",
                  }}
                >
                  <Link to="/dashboard/home">Getting Started</Link>
                </BTN>
                <Box>
                  <Icon
                    as={Arrow}
                    color={"white"}
                    w={71}
                    position={"absolute"}
                    right={-71}
                    top={"26px"}
                    style={{ animation: "fadeInOut 5s infinite" }}
                  />
                  <Text
                    fontSize={"lg"}
                    fontFamily={"Caveat"}
                    position={"absolute"}
                    right={"-125px"}
                    top={"-15px"}
                    transform={"rotate(10deg)"}
                  >
                    <span className="text-bluchp">Starting with no Cost</span>
                  </Text>
                </Box>
              </Stack>
            </Stack>
          </Container>
        </div>
      </div>
    </Form>
  );
}
