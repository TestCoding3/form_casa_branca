import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useState } from "react";

export default function Form() {
  const [form, setForm] = useState([]);
  return (
    <Card color="transparent" shadow={false}>
      <Typography variant="h4" color="blue-gray">
        Fazenda Casa Branca
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Enter your details to register.
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" label="Diarista" />
          <Input size="lg" label="Dados Bancários" />
          <Input type="password" size="lg" label="Qtd" />
        </div>
        <Button className="mt-6" fullWidth>
          Register
        </Button>
      </form>
    </Card>
  );
}
