import { Tabs as ChakraTabs } from "@chakra-ui/react";
import * as React from "react";

export const TabsRoot = ChakraTabs.Root;
export const TabsList = ChakraTabs.List;
export const TabsTrigger = ChakraTabs.Trigger;
export const TabsContent = ChakraTabs.Content;
export const TabsContentGroup = ChakraTabs.ContentGroup;
export const TabsIndicator = ChakraTabs.Indicator;

export interface TabsProps extends ChakraTabs.RootProps {
  variant?: ChakraTabs.RootProps["variant"];
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  function Tabs(props, ref) {
    return <ChakraTabs.Root ref={ref} {...props} />;
  },
);

