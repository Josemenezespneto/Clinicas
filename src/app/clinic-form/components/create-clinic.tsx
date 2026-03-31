"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { createClinicAction } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ClinicFormSchema = z.infer<typeof clinicFormSchema>;

const clinicFormSchema = z.object({
  name: z.string().trim().min(2, { message: "O nome é obrigatório." }),
});

export const CreateClinic = () => {
  const form = useForm<ClinicFormSchema>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: ClinicFormSchema) => {
    form.clearErrors("root");
    try {
      await createClinicAction(values.name);
    } catch (error) {
      if (isRedirectError(error)) return;
      toast.error("Ocorreu um erro ao criar a clínica. Tente novamente.");
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="animate-spin w-4 h-4" />
              )}
              Criar Clínica
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
