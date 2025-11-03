import React from "react";
import { TableRow, TableCell } from "@material-ui/core";
import { Skeleton } from "@/components/ui/skeleton";

interface TableRowSkeletonProps {
  avatar?: boolean;
  columns?: number;
}

const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({ 
  avatar = false, 
  columns = 4 
}) => {
  return (
    <>
      {[1, 2, 3, 4].map((row) => (
        <TableRow key={row}>
          {avatar && (
            <TableCell>
              <Skeleton className="h-10 w-10 rounded-full" />
            </TableCell>
          )}
          {Array.from({ length: columns }).map((_, index) => (
            <TableCell key={index}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableRowSkeleton;
