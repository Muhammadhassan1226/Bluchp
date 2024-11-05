import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import "tailwindcss/tailwind.css";
import "./custom.css";
import {
  Box,
  Heading,
  Container,
  Text,
  Button as BTN,
  Stack,
  Icon,
  createIcon,
} from "@chakra-ui/react";
import { Alert, AlertIcon } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useMutation } from "@tanstack/react-query";

import useShowToast from "@/hooks/toast";
import { LoaderCircle } from "lucide-react";
import { otpVerify } from "@/http/auth";
import { setOTP } from "@/store/features/Otp.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
const formSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

const Arrow = createIcon({
  displayName: "Arrow",
  viewBox: "0 0 72 24",
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="#DFF4FF"
    />
  ),
});

export function OTP() {
  const dispatch = useAppDispatch();
  const otp = useAppSelector((state) => state.otp.otp);

  const toast = useShowToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: otp?.email || "",
      otp: "",
    },
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: otpVerify,
    onSuccess: (data) => {
      navigate("/auth/reset", { replace: true });
      const userData = data.data?.data;
      dispatch(setOTP(userData));

      import.meta.env.VITE_NODE_ENV === "development"
        ? console.log(userData)
        : "";
      toast(
        "OTP Verified Successfully.",
        "Enter new Password to Countinue",
        "success"
      );
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

    import.meta.env.VITE_NODE_ENV ? console.log(values) : "";
    mutation.mutate(values);

    import.meta.env.VITE_NODE_ENV === "development" ? console.log(values) : "";
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="w-full mt-2 lg:grid lg:min-h-[200px] lg:grid-cols-2 xl:min-h-[800px] bg-bluchp">
        <div className="flex items-start justify-center ">
          <div className="mt-0 grid w-[350px] gap-6 ">
            <img src="/logo.png" alt="logo" className="w-20 h-21  mx-auto" />
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold text-bgBluchp">
                OTP Verification
              </h1>
              <p className="text-balance text-bgBluchp">
                Please Verify your otp to continue
              </p>
            </div>
            <Alert status="info" variant="left-accent">
              <AlertIcon />
              Please see below for Otp Input
            </Alert>
            <div className="grid gap-4">
              <Controller
                name="otp"
                control={form.control}
                render={({ field }) => (
                  <InputOTP maxLength={6} {...field} className="bg-bgBluchp">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />

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
                  <span className="ml-2">Verify</span>
                </Button>
              </div>
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
                  Verify
                </span>{" "}
                <br />
                <Text as={"span"} color={"green.400"}>
                  OTP
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
    </form>
  );
}
