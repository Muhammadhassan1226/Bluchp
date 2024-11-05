import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RecentGaines } from "@/http/stock";
import { Gainer } from "@/types/stock";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useAppSelector } from "@/store/store";
import useShowToast from "@/hooks/toast";
import { useNavigate } from "react-router-dom";
import { DummyGainers } from "@/data/gainers";
const Stocktable = () => {
  const { data } = useQuery<Gainer[]>({
    queryKey: ["RecentGainer"],
    queryFn: RecentGaines,
    staleTime: 120000,
  });
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();
  const toast = useShowToast();
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [animated, setAnimated] = useState(false);

  // useEffect(() => {
  //   let intervalId: any;

  //   if (data && data.length > 0) {
  //     intervalId = setInterval(() => {
  //       setAnimated(true);
  //       setCurrentIndex((prevIndex) =>
  //         prevIndex === data.length - 1 ? 0 : prevIndex + 1
  //       );
  //       setAnimated(false);
  //     }, 2000); // Adjust the interval as needed for your animation speed
  //   }

  //   return () => clearInterval(intervalId);
  // }, [data]);
  const displayStock = data && data.length > 0 ? data : DummyGainers;

  if (!displayStock) return <LoaderCircle size={20} className="animate-spin" />;

  // const currentData = data[currentIndex];

  if (!user) {
    navigate("/dashboard/home", { replace: true });
    toast(
      "Please Login First",
      "Please Login First for view Stocks Prices",
      "warning"
    );
  }
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Recent Gainers</CardTitle>
        <CardDescription>Latest Stock Market Gainers</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="hidden sm:table-cell">Change</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayStock?.map((stock) => (
              <TableRow>
                <TableCell>
                  <div className="font-medium">{stock.symbol || "Bluchp"}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{stock.change}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs">{stock.price}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {stock.changesPercentage}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Stocktable;
