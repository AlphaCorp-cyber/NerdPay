import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Merchant } from "@shared/schema";

interface MerchantsTableProps {
  merchants: Merchant[];
  onEdit: (merchant: Merchant) => void;
  onDelete: (merchant: Merchant) => void;
}

export default function MerchantsTable({ merchants, onEdit, onDelete }: MerchantsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Business Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {merchants.map((merchant) => (
          <TableRow key={merchant.id} className="hover:bg-gray-50">
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">{merchant.businessName}</p>
                <p className="text-sm text-gray-500">{merchant.name}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm text-gray-900">{merchant.email}</p>
                <p className="text-xs text-gray-500">{merchant.phone}</p>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-700">{merchant.businessType}</span>
            </TableCell>
            <TableCell>
              <Badge className={merchant.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {merchant.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-500">
                {formatDate(merchant.createdAt!)}
              </span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onEdit(merchant)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(merchant)} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
