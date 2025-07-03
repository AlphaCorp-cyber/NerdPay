import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime, getStatusColor } from "@/lib/utils";
import { CreditCard, Smartphone, Wallet, Building } from "lucide-react";
import type { Transaction, PaymentMethod } from "@shared/schema";

interface TransactionsTableProps {
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}

export default function TransactionsTable({ transactions, paymentMethods }: TransactionsTableProps) {
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "mobile_money":
        return <Smartphone className="w-4 h-4 text-green-600" />;
      case "card":
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case "digital_wallet":
        return <Wallet className="w-4 h-4 text-purple-600" />;
      default:
        return <Building className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPaymentMethodName = (id: number) => {
    const method = paymentMethods.find(pm => pm.id === id);
    return method?.name || "Unknown";
  };

  const getPaymentMethodType = (id: number) => {
    const method = paymentMethods.find(pm => pm.id === id);
    return method?.type || "unknown";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="hover:bg-gray-50">
            <TableCell>
              <div>
                <p className="font-medium text-gray-900">#{transaction.transactionId}</p>
                <p className="text-sm text-gray-500">{transaction.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium text-gray-900">
                {formatCurrency(transaction.amount, transaction.currency)}
              </span>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                {getPaymentMethodIcon(getPaymentMethodType(transaction.paymentMethodId!))}
                <span className="text-gray-700">{getPaymentMethodName(transaction.paymentMethodId!)}</span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm text-gray-900">{transaction.customerEmail}</p>
                <p className="text-xs text-gray-500">{transaction.customerPhone}</p>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-500">
                {formatRelativeTime(transaction.createdAt!)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
