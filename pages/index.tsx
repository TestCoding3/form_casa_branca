import Form from "@/public/components/form";
import { Box, ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  return (
    <ChakraProvider>
      <Box
        bgColor={"blackAlpha.50"}
      >
        <Form />
      </Box>
    </ChakraProvider>
  );
}
