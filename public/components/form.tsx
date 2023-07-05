import {
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { object, string, number, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import logo from "../../images/logo.svg";
import appState from "../hooks/appState";
import { useState } from "react";

export default function Form() {
  const { table, setTable } = appState();
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    week: string().required("Escolha a semana de trabalho."),
    dailyWorker: string().required("Preencha o nome do diarista."),
    bankInfo: string().required(
      "Preencha as informações de pagamento do trabalhador."
    ),
    service: string().required("Escolha o tipo de serviço."),
    quantity: number().required("Preencha a quantidade do serviço."),
    paymentDay: string().required("Escolha a data de pagamento."),
  });

  const { control, handleSubmit } = useForm<DailyWorkersManagementForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      week: "",
      dailyWorker: "",
      bankInfo: "",
      service: "",
      quantity: 0,
      paymentDay: "",
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
    const newTable = table;
    newTable.push({
      week,
      dailyWorker,
      bankInfo,
      service,
      quantity,
      paymentDay,
    });
    setTable(newTable);
    setLoading(false);
  };

  return (
    <Card
      className="lg:m-16 m-3"
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
          <FormControl variant="floating" isRequired isInvalid={Boolean(error)}>
            <FormLabel>Semana</FormLabel>
            <Input
              placeholder=""
              h={12}
              value={value}
              onChange={onChange}
              type="week"
              disabled={table.length > 0}
            />
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="dailyWorker"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormControl variant="floating" isRequired isInvalid={Boolean(error)}>
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
          <FormControl variant="floating" isRequired isInvalid={Boolean(error)}>
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
          <FormControl variant="floating" isRequired isInvalid={Boolean(error)}>
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
          <FormControl variant="floating" isRequired isInvalid={Boolean(error)}>
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
          <FormControl variant="floating" isRequired isInvalid={Boolean(error)}>
            <FormLabel>Data do pagamento</FormLabel>
            <Input
              placeholder=""
              h={12}
              value={value?.toString()}
              onChange={onChange}
              type="date"
              disabled={table.length > 0}
            />
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>
        )}
      />

      <Button
        h={12}
        className="lg:w-1/3 w-1/2"
        onClick={handleSubmit(handleAdd)}
        isDisabled={loading}
        mt={4}
        colorScheme="green"
      >
        Adicionar dados
      </Button>
    </Card>
  );
}
