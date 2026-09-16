import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDeployments } from "@/api/diploymentApi";
import type { Deployment } from "@/types";

import Example3 from "./example3";

vi.mock("@/api/diploymentApi", () => ({
  getDeployments: vi.fn(),
}));

const deployments: Deployment[] = [
  {
    id: "DEP-1001",
    application: "Customer Portal",
    version: "v4.2.1",
    environment: "Production",
    status: "Pending",
    requestedBy: "John Smith",
    requestedAt: "2026-07-18T09:30:00Z",
    scheduledAt: "2026-07-20T10:00:00Z",
    region: "US-East",
    priority: "High",
  },
  {
    id: "DEP-1002",
    application: "Payments API",
    version: "v2.8.0",
    environment: "QA",
    status: "In Progress",
    requestedBy: "Emily Davis",
    requestedAt: "2026-07-18T10:15:00Z",
    scheduledAt: "2026-07-20T11:30:00Z",
    region: "Europe",
    priority: "Critical",
  },
];

function renderQueue() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Example3 />
    </QueryClientProvider>
  );
}

describe("Example3", () => {
  beforeEach(() => {
    vi.mocked(getDeployments).mockReset();
  });

  it("shows a loading state while deployments are fetched", () => {
    vi.mocked(getDeployments).mockReturnValue(new Promise(() => {}));

    renderQueue();

    expect(screen.getByText("Loading deployments...")).toBeInTheDocument();
  });

  it("renders deployments and the total count after loading", async () => {
    vi.mocked(getDeployments).mockResolvedValue(deployments);

    renderQueue();

    expect(await screen.findByText("Customer Portal")).toBeInTheDocument();
    expect(screen.getByText("Payments API")).toBeInTheDocument();
    expect(screen.getByText("Total Deployments: 2")).toBeInTheDocument();
    expect(screen.getByText("Showing 2 of 2")).toBeInTheDocument();
  });

  it("filters deployments by application search", async () => {
    vi.mocked(getDeployments).mockResolvedValue(deployments);

    renderQueue();

    await screen.findByText("Customer Portal");

    fireEvent.change(screen.getByLabelText("Search by application name"), {
      target: { value: "payments" },
    });

    expect(screen.queryByText("Customer Portal")).not.toBeInTheDocument();
    expect(screen.getByText("Payments API")).toBeInTheDocument();
    expect(screen.getByText("Showing 1 of 2")).toBeInTheDocument();
  });

  it("shows an empty state when the Failed status filter has no matches", async () => {
    vi.mocked(getDeployments).mockResolvedValue(deployments);

    renderQueue();

    await screen.findByText("Customer Portal");

    fireEvent.click(screen.getByRole("button", { name: /Failed/ }));

    expect(
      screen.getByText("No deployments match your search or filter.")
    ).toBeInTheDocument();
  });

  it("shows an error state when the request fails", async () => {
    vi.mocked(getDeployments).mockRejectedValue(new Error("Network error"));

    renderQueue();

    expect(await screen.findByText("Network error")).toBeInTheDocument();
  });
});
