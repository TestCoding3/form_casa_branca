import Form from "@/public/components/form";
import InputTable from "@/public/components/table";
import { Box, ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  return (
    <ChakraProvider>
      <Box bgColor={"blackAlpha.50"} py={4}>
        <Form />
        <InputTable />
      </Box>
    </ChakraProvider>
  );
}
