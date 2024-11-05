import { useToast } from "@chakra-ui/toast";
import { useCallback, useRef } from "react";

// Update useShowToast to handle toast creation and storing toast ID
const useShowToastload = () => {
  const toast = useToast();
  const toastRef = useRef<string | number | undefined>(undefined); // Ref to store the toast ID

  const showToast = useCallback(
    (
      title: string,
      description: string,
      status: any,
      duration?: number | null
    ) => {
      toastRef.current = toast({
        title,
        description,
        status,
        duration,
        isClosable: true,
      });
    },
    [toast]
  );

  const dismissToast = useCallback(() => {
    if (toastRef.current) {
      toast.close(toastRef.current); // Use toast.close to dismiss by ID
    }
  }, [toast]);

  return { showToast, dismissToast };
};

export default useShowToastload;
