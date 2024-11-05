import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardStockdata } from "@/http/stock";
import { DashboardStock } from "@/types/stock";
import { useState, useEffect } from "react";
import { MdAccountBalance } from "react-icons/md";
import { Dummydashborad } from "@/data/dashboard";
const Home = () => {
  const { data: stock } = useQuery<DashboardStock[]>({
    queryKey: ["dashboardstock"],
    queryFn: DashboardStockdata,
    staleTime: 120000,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const displayStock = stock && stock.length > 0 ? stock : Dummydashborad;
  // Update data index every second
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
    return <div>No data available...</div>;
  // Current data to display
  const currentData = displayStock[currentIndex];
  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {currentData.companyName}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-1xl font-bold">{currentData.marketCap}</div>
              <p className="text-xs text-muted-foreground">
                {currentData.volume}
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
              <CardTitle className="text-sm font-medium">
                {currentData.sector || "Bluchp"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {currentData.industry || "Unkown"}
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
              <CardTitle className="text-sm font-medium">
                {currentData.country || "Unkown"}
              </CardTitle>
              <MdAccountBalance className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentData.exchangeShortName}
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Price</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentData.price}</div>
              <p className="text-xs text-muted-foreground">
                {currentData.lastAnnualDividend}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Home;
