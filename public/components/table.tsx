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
    try {
      const response = await api.post(
        "/api/submit",
        { table, discount: 0 },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "generated.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log("Ocorreu um erro com seu download:", error);
    }
    setLoading(false);
  };

  return (
    <>
      {table && table.length > 0 && (
        <Card
          className="lg:m-16 m-3"
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
            isDisabled={loading}
            h={12}
            className="lg:w-1/3 w-1/2"
            mt={4}
          >
            {loading ? "Baixando" : "Gerar PDF"}
          </Button>
        </Card>
      )}
    </>
  );
}
