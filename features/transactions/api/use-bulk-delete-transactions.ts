import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import Error from "next/error";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.transactions["bulk-delete"]["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // Todo: Also invalidate summary
    },
    onError: () => {
      toast.success("Failed to deleted transactions");
    },
  });

  return mutation;
}