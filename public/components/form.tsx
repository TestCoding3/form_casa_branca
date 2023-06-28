import {
  Box,
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { object, string, number, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import logo from "../images/logo.svg";

export default function Form() {
  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState<DailyWorkersManagementForm[]>([]);

  const schema = object().shape({
    week: string().required("Escolha a semana de trabalho."),
    dailyWorker: string().required("Preencha o nome do diarista."),
    bankInfo: string().required(
      "Preencha as informações de pagamento do trabalhador."
    ),
    service: string().required("Escolha o tipo de serviço."),
    quantity: number().required("Preencha a quantidade do serviço."),
    paymentDay: date().required("Escolha a data de pagamento."),
  });

  const { control, handleSubmit } = useForm<DailyWorkersManagementForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      week: "",
      dailyWorker: "",
      bankInfo: "",
      service: "",
      quantity: 0,
      paymentDay: undefined,
    },
  });

  const handleAdd: SubmitHandler<DailyWorkersManagementForm> = ({
    week,
    dailyWorker,
    bankInfo,
    service,
    quantity,
    paymentDay,
  }: DailyWorkersManagementForm) => {
    setLoading(true);
    setTable((prevTable) => [
      ...prevTable,
      {
        week,
        dailyWorker,
        bankInfo,
        service,
        quantity,
        paymentDay,
      },
    ]);
    setLoading(false);
  };

  const cost = (service: string, quantity: number) => {
    var cost = 0;
    service === "Diária" ? (cost = 80 * quantity) : (cost = 40 * quantity);
    return cost;
  };

  return (
    <Box py={2}>
      <Card
        m={16}
        p={8}
        gap={4}
        shadow={"xl"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Image src={logo} alt="logo" height={120} />
        <Controller
          control={control}
          name="week"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(error)}
            >
              <FormLabel>Semana</FormLabel>
              <Input
                placeholder=""
                h={12}
                value={value}
                onChange={onChange}
                type="week"
              />
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name="dailyWorker"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(error)}
            >
              <FormLabel>Nome do Diarista</FormLabel>
              <Input
                placeholder=""
                h={12}
                value={value}
                onChange={onChange}
                type="text"
              />
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="bankInfo"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(error)}
            >
              <FormLabel>Dados Bancários</FormLabel>
              <Input
                placeholder=""
                h={12}
                value={value}
                onChange={onChange}
                type="text"
              />
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="service"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(error)}
            >
              <FormLabel>Tipo de serviço</FormLabel>
              <Select
                variant="filled"
                h={12}
                defaultValue={value}
                onChange={onChange}
                placeholder="Selecione um tipo de serviço"
              >
                <option label={"Diária"} value={"Diária"} />
                <option label={"Horas extras"} value={"Horas extras"} />
              </Select>
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="quantity"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(error)}
            >
              <FormLabel>Quantidade</FormLabel>
              <Input
                placeholder=""
                h={12}
                value={value}
                onChange={onChange}
                type="number"
              />
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="paymentDay"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(error)}
            >
              <FormLabel>Data do pagamento</FormLabel>
              <Input
                placeholder=""
                h={12}
                value={value?.toString()}
                onChange={onChange}
                type="date"
              />
              <FormErrorMessage>{error?.message}</FormErrorMessage>
            </FormControl>
          )}
        />

        <Button
          h={12}
          w="30%"
          onClick={handleSubmit(handleAdd)}
          isDisabled={loading}
          mt={4}
          colorScheme="green"
        >
          Adicionar dados
        </Button>
      </Card>
      {table.length > 0 && (
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
                  <Th isNumeric>500</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
