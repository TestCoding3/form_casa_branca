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
  Button,
} from "@chakra-ui/react";
import { api } from "../services/api";

import { DeleteIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function InputTable() {
  const [loading, setLoading] = useState(false);
  const { table, total, deleteInput } = appState();

  const cost = (service: string, quantity: number) => {
    var cost = 0;
    service === "Diária" ? (cost = 80 * quantity) : (cost = 15 * quantity);
    return cost;
  };

  const handleDelete = (index: number) => {
    deleteInput(index);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await api.post("api/submit", table);
    console.log(response);
    setLoading(false);
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
                  <Th></Th>
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
                      <Td textAlign={"right"}>
                        <Button onClick={() => handleDelete(key)}>
                          <DeleteIcon></DeleteIcon>
                        </Button>
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
          <Button
            colorScheme="green"
            onClick={() => handleSubmit()}
            disabled={loading}
            h={12}
            w="30%"
            mt={4}
          >
            Gerar PDF
          </Button>
        </Card>
      )}
    </>
  );
}
