
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ArrowUpCircle, ArrowDownCircle, ShoppingCart } from 'lucide-react';





function FinancialHistory() {
  

    return (
        <Card className="bg-white/5 border-white/10 text-white mt-4">
            <CardHeader>
                <CardTitle>Historial de Transacciones Financieras</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/20 hover:bg-white/10">
                                <TableHead className="text-white">Tipo</TableHead>
                                <TableHead className="text-white">Desde</TableHead>
                                <TableHead className="text-white">Hacia</TableHead>
                                <TableHead className="text-white ">Monto</TableHead>
                                <TableHead className="text-white text-right">Fecha y Hora</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* {(transactionHistory || []).map((t) => (
                                <TableRow key={t.id} className="border-white/20 hover:bg-white/10">
                                    <TableCell className="font-mono">{formatDateTime(t.timestamp)}</TableCell>
                                    <TableCell>
                                        <TransactionType type={t.type} fromType={t.fromType} toType={t.toType} />
                                    </TableCell>
                                    <TableCell>{getEntityName(t.fromType, t.fromId)}</TableCell>
                                    <TableCell>{getEntityName(t.toType, t.toId)}</TableCell>
                                    <TableCell className="text-right font-mono">${(t.amount || 0).toLocaleString()}</TableCell>
                                </TableRow>
                            ))} */}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

export default FinancialHistory;
