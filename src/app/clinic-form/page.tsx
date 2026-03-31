import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CreateClinic } from "./components/create-clinic";

const ClinicFormPage = () => {
  return (
    <div>
      <Dialog open={true}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Criar Clinica</DialogTitle>
            <DialogDescription>Adicione uma nova clinica</DialogDescription>
          </DialogHeader>
          <CreateClinic />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicFormPage;
