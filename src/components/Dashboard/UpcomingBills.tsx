import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBills } from "@/contexts/bills-context";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function UpcomingBills() {
  const { getUpcomingBills } = useBills();
  const upcomingBills = getUpcomingBills();
  const navigate = useNavigate();

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBills.length === 0 ? (
            <p className="text-muted-foreground">No upcoming bills</p>
          ) : (
            <>
              {upcomingBills.map((bill) => {
                const daysUntilDue = getDaysUntilDue(bill.dueDate);
                return (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{bill.description}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(bill.dueDate).toLocaleDateString()}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                          {daysUntilDue === 0 
                            ? "Due today"
                            : daysUntilDue === 1
                            ? "Due tomorrow"
                            : `Due in ${daysUntilDue} days`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{bill.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">₹{bill.amount.toLocaleString()}</p>
                      <p className="text-xs text-orange-600 font-medium">Pending</p>
                    </div>
                  </div>
                );
              })}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate("/bills")}
              >
                View All Bills
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
