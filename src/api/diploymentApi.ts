import { data } from "../data/MOCK_DATA";
import type { Deployment } from "@/types";

export async function getDeployments(): Promise<Deployment[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return data as Deployment[];
}
