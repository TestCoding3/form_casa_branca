import { useState, useEffect } from "react";
import appState from "../hooks/appState";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Card,
  Tr,
} from "@chakra-ui/react";

export default function InputTable() {
  const { table, total } = appState();

  const cost = (service: string, quantity: number) => {
    var cost = 0;
    service === "Diária" ? (cost = 80 * quantity) : (cost = 15 * quantity);
    return cost;
  };
  return (
    <>
      {table && table.length > 0 && (
        <Card
          m={16}
          p={8}
          gap={4}
          shadow={"xl"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <TableContainer>
            <Table variant="simple">
              <TableCaption placement="top" mb={4}>
                Dados adicionados
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>diarista</Th>
                  <Th>dados bancários</Th>
                  <Th>serviço</Th>
                  <Th>quantidade</Th>
                  <Th>valor</Th>
                </Tr>
              </Thead>
              <Tbody>
                {table?.map((current, key) => {
                  return (
                    <Tr key={key}>
                      <Td>{current.dailyWorker}</Td>
                      <Td>{current.bankInfo}</Td>
                      <Td>{current.service}</Td>
                      <Td textAlign={"right"}>{current.quantity}</Td>
                      <Td textAlign={"right"}>
                        {cost(current.service, current.quantity)}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Total</Th>
                  <Th></Th>
                  <Th></Th>
                  <Th></Th>
                  <Th isNumeric>{total}</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  );
}
