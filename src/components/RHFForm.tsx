import {
  type JSX,
  type HTMLAttributes,
  type ReactNode,
  type ComponentProps,
} from "react";
import {
  FormProvider,
  type FormProviderProps,
  type FieldValues,
} from "react-hook-form";
import { chakra } from "@chakra-ui/react";

// -----------------------------------------------------------------------------

export type RHFFormProps<
  FormInput extends FieldValues,
  Context,
  ValidatorOutput,
> = {
  methods: Omit<
    FormProviderProps<FormInput, Context, ValidatorOutput>,
    "children"
  >;
  onSubmit: HTMLAttributes<HTMLFormElement>["onSubmit"];
  children: ReactNode;
} & ComponentProps<typeof ChakraForm>;

const ChakraForm = chakra("form");

export default function RHFForm<
  FormInput extends FieldValues,
  Context,
  ValidatorOutput,
>({
  onSubmit,
  children,
  methods,
  ...rest
}: RHFFormProps<FormInput, Context, ValidatorOutput>): JSX.Element {
  return (
    <FormProvider {...methods}>
      <ChakraForm {...rest} noValidate onSubmit={onSubmit}>
        {children}
      </ChakraForm>
    </FormProvider>
  );
}
