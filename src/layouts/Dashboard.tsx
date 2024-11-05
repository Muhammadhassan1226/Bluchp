import { Link, Outlet, useNavigate } from "react-router-dom";
import { Home, Menu, MoonIcon, Package2, Sun, Handshake, Newspaper } from "lucide-react";
import { AiOutlineStock } from "react-icons/ai";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Logout } from "@/http/auth";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar } from "@chakra-ui/react";
import { Sidebardata } from "@/data/sidebar";
import Stockapi from "@/components/ui/stockapi";
import { useAppSelector, useAppDispatch } from "@/store/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sidebarapi } from "@/http/stock";
import { Sidebar } from "@/types/stock";
import useToken from "@/store/zustand";
import { useDate } from "@/store/zustand";
import { api } from "@/http/base";
import { setUser } from "@/store/features/userSlice";
export function Dashboard() {
  const dispatch = useAppDispatch();

  const [darkMode, setDarkMode] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const setToken = useToken((state) => state.setToken);
  const setDate = useDate((state) => state.setCreateddate);
  const user = useAppSelector((state) => state.user.user);

  const navigate = useNavigate();
  // Update data index every second
  const mutation = useMutation({
    mutationFn: Logout,
    onSuccess: () => {
      dispatch(setUser(null));
    },
  });

  api.interceptors.request.use((config) => {
    const token = useToken.getState().token;
    console.log("Sending token:", token); // Add this line
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const { data: stock } = useQuery<Sidebar[]>({
    queryKey: ["Sidebardata"],
    queryFn: Sidebarapi,
    staleTime: 120000,
  });

  const displayStock = stock && stock.length > 0 ? stock : Sidebardata;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (displayStock && displayStock.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === displayStock.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [displayStock]);

  if (!displayStock || displayStock.length === 0)
    return <div>No data in dashboard...</div>;
  const currentData = displayStock[currentIndex];
  // Current data to display
  const handleLogout = () => {
    try {
      navigate("/auth/login", { replace: true });
      setToken("");
      setDate("");
      mutation.mutate();
    } catch (error) {
      import.meta.env.VITE_NODE_ENV === "development" ? console.log(error) : "";
    }
  };

  const handlerest = () => {
    try {
      navigate("/auth/email_verify", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };
  function handledark() {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  const username = user?.username;

  const handleProfileClick = () => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="">
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 dark:bg-bgBluchp">
              <Link
                to="/dashboard/home"
                className="flex items-center gap-2 font-semibold"
              >
                {darkMode ? (
                  <img className="h-6 w-6 " src="/logo.png" />
                ) : (
                  <img className="h-7 w-7 rounded-md" src="/colorlogo.png" />
                )}
                <span className="text-bgBluchp dark:text-bluchp">Bluchp</span>
              </Link>
            </div>
            <div className="flex-1 dark:bg-bgBluchp">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4 text-bgBluchp">
                <Link
                  to="/dashboard/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Home className="h-4 w-4 dark:text-bluchp" />
                  <span className="dark:text-bluchp">Home</span>
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/dashboard/stocks"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <AiOutlineStock className="h-4 w-4 dark:text-bluchp" />
                      <span className="dark:text-bluchp">Stocks</span>
                    </Link>
                  </>
                ) : null}
                {user ? (
                  <Link
                    to="/dashboard/social"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Handshake className="h-4 w-4 dark:text-bluchp" />
                    <span className="dark:text-bluchp">Social</span>
                  </Link>
                ) : null}
                <Link
                  to="/dashboard/home"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                <Newspaper className="h-4 w-4 dark:text-bluchp" />
                <span className="dark:text-bluchp">News</span>
                </Link>
              </nav>
            </div>
            <Table className="dark:bg-bgBluchp">
              <TableHeader>
                <TableRow>
                  <TableHead className="dark:text-bluchp">Symbol</TableHead>
                  <TableHead className="hidden sm:table-cell dark:text-bluchp">
                    Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium dark:text-white">
                      {currentData.symbol}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium dark:text-white">
                      {currentData.price}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="mt-auto p-4 dark:bg-bgBluchp">
              {user ? (
                <>
                  <Card x-chunk="dashboard-02-chunk-0">
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <p>Hi! 👋</p>

                      <CardTitle className="font-semibold">
                        {user?.username}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                      <Button size="sm" className="w-full">
                        <Link to="/dashboard/stocks">Explore</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card x-chunk="dashboard-02-chunk-0">
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <CardTitle className="font-semibold">
                        Login or Signup
                      </CardTitle>
                      <CardDescription>
                        Unlock all features and get unlimited access to our
                        Platform .
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                      <Button size="sm" className="w-full">
                        <Link to="/auth/register">Signup</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col dark:bg-bgBluchp">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 dark:bg-bgBluchp">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col ">
                <nav className="grid gap-2 text-lg font-medium dark:bg-bgBluchp">
                  <Link
                    to="/dashboard/home"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Bluchp</span>
                  </Link>
                  <Link
                    to="/dashboard/home"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    <Home className="h-4 w-4 dark:text-bluchp" />
                    <span className="dark:text-bluchp">Home</span>
                  </Link>
                </nav>
                <div className="mt-auto">
                  {user ? (
                    <>
                      <p>User</p>
                    </>
                  ) : (
                    <>
                      {/* <Card>
                        <CardHeader>
                          <CardTitle>Login or Signup</CardTitle>
                          <CardDescription>
                            Unlock all features and get unlimited access to our
                            Platform.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button size="sm" className="w-full">
                            <Link to="/auth/register">Signup</Link>
                          </Button>
                        </CardContent>
                      </Card> */}
                      <p>User Not</p>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1 ">
              {darkMode ? (
                <MoonIcon onClick={handledark} />
              ) : (
                <Sun onClick={handledark} className="text-bluchp" />
              )}
            </div>

            <DropdownMenu>
              {user ? (
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    {/* /<CircleUser className="h-5 w-5" />  */}
                    <Avatar
                      name={user?.username}
                      src={user?.profileImg}
                      size="sm"
                    />

                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
              ) : (
                <>
                  <Link to="/auth/register">
                    <Button
                      variant={"outline"}
                      className="w-15 dark:text-bgBluchp dark:bg-bluchp bg-bgBluchp text-bluchp font-bold"
                    >
                      Sign up
                    </Button>
                  </Link>
                  <Link to="/auth/login">
                    <Button
                      variant={"outline"}
                      className="w-15 dark:text-bgBluchp dark:bg-bluchp bg-bgBluchp text-bluchp font-bold"
                    >
                      Log in
                    </Button>
                  </Link>
                </>
              )}
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  Proflie
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlerest}>
                  Reset Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <Stockapi />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
