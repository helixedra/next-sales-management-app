import { toast } from "sonner";

export default function ErrorComponent({ message }: { message: string }) {
  toast.error(message);
  return null;
}
