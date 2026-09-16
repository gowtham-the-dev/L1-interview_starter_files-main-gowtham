import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Deployment } from "@/types";

import DeploymentCard from "./example1";

const deployment: Deployment = {
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
};

describe("DeploymentCard", () => {
  it("renders the application name", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("Customer Portal")
    ).toBeInTheDocument();
  });

  it("renders the deployment id", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("DEP-1001")
    ).toBeInTheDocument();
  });

  it("renders the version", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("v4.2.1")
    ).toBeInTheDocument();
  });


  it("renders the deployment status", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("Pending")
    ).toBeInTheDocument();
  });

  it("renders the environment", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(screen.getByText("Production")).toBeInTheDocument();
  });

  it("renders the priority", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders the region", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(screen.getByText("US-East")).toBeInTheDocument();
  });

  it("renders the requested by value", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText("John Smith")
    ).toBeInTheDocument();
  });

  it("renders the scheduled date", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByText(/2026/i)
    ).toBeInTheDocument();
  });

  it("shows Advance to In Progress when status is Pending", () => {
    render(<DeploymentCard deployment={deployment} />);

    expect(
      screen.getByRole("button", { name: "Advance to In Progress" })
    ).toBeEnabled();
  });

  it("shows Advance to Completed when status is In Progress", () => {
    render(
      <DeploymentCard
        deployment={{ ...deployment, status: "In Progress" }}
      />
    );

    expect(
      screen.getByRole("button", { name: "Advance to Completed" })
    ).toBeEnabled();
  });

  it("disables the action button when status is Completed", () => {
    render(
      <DeploymentCard deployment={{ ...deployment, status: "Completed" }} />
    );

    expect(screen.getByRole("button", { name: "Completed" })).toBeDisabled();
  });
});

