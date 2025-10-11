import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusLower = status.toLowerCase();

  const variant =
    statusLower === "new" ? "default" :
    statusLower === "contacted" || statusLower === "followed up" ? "secondary" :
    statusLower === "enrolled" || statusLower === "approved" || statusLower === "published" ? "success" :
    statusLower === "archived" ? "outline" :
    "destructive";
    
  const colorClass = 
    statusLower === "new" ? "bg-blue-500 hover:bg-blue-600" :
    statusLower === "contacted" || statusLower === "followed up" ? "bg-yellow-500 hover:bg-yellow-600 text-yellow-900" :
    statusLower === "enrolled" || statusLower === "approved" || statusLower === "published" ? "bg-green-500 hover:bg-green-600" :
    statusLower === "archived" ? "bg-gray-500 hover:bg-gray-600" :
    "bg-red-500 hover:bg-red-600";


  return (
    <Badge variant="default" className={cn("capitalize text-primary-foreground border-transparent", colorClass)}>
      {status}
    </Badge>
  );
}
