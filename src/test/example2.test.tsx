import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useDeploymentFilters } from "./example2";

const deployments = [
  {
    application: "Customer Portal",
    status: "Pending",
    scheduledAt: "2026-07-20T10:00:00Z",
  },
  {
    application: "Payments API",
    status: "In Progress",
    scheduledAt: "2026-07-18T11:30:00Z",
  },
  {
    application: "Inventory Service",
    status: "Completed",
    scheduledAt: "2026-07-19T09:00:00Z",
  },
];

const sortedBySchedule = [
  deployments[1],
  deployments[2],
  deployments[0],
];

describe("useDeploymentFilters", () => {
  it("returns deployments sorted by scheduled date when search is empty", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    expect(result.current.filteredDeployments).toEqual(sortedBySchedule);
  });

  it("filters by application name case-insensitively", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setSearch("customer");
    });

    expect(result.current.filteredDeployments).toEqual([deployments[0]]);
  });

  it("returns an empty list when no deployments match", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setSearch("does-not-exist");
    });

    expect(result.current.filteredDeployments).toEqual([]);
  });

  it("filters by status", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setStatus("Completed");
    });

    expect(result.current.filteredDeployments).toEqual([deployments[2]]);
  });

  it("sorts filtered deployments by scheduledAt ascending", () => {
    const unsorted = [deployments[0], deployments[1]];
    const { result } = renderHook(() => useDeploymentFilters(unsorted));

    expect(result.current.filteredDeployments).toEqual([
      deployments[1],
      deployments[0],
    ]);
  });
});
