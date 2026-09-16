/**
 * ============================================================================
 * Exercise 3 - Deployment Queue
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Congratulations!
 *
 * The DeploymentCard component and search functionality have been completed.
 *
 * Your next task is to build the Deployment Queue page by integrating the
 * previous exercises.
 *
 * ============================================================================
 *
 * Requirements
 *
 * Build a Deployment Queue page using the supplied mock API response.
 *
 * The page should display all deployments using the DeploymentCard component
 * created in Exercise 1.
 *
 * Use the custom hook created in Exercise 2 for searching deployments.
 *
 * ============================================================================
 *
 * Functional Requirements
 *
 * 1. Fetch deployments using React Query.
 *
 * 2. Display all deployments.
 *
 * 3. Search deployments by Application Name.
 *
 * 4. Display the following summary:
 *
 *      Total Deployments
 *
 * 5. Add a Status filter.
 *
 *      All
 *      Pending
 *      In Progress
 *      Completed
 *      Failed
 *
 * 6. Display an Empty State when no deployments match the search/filter.
 *
 * 7. Display a Loading State while data is loading.
 *
 * 8. Display an Error State when the request fails.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • React Query
 *
 * • TypeScript
 *
 * • Reusable Components
 *
 * • Clean Folder Structure
 *
 * • Avoid duplicated logic
 *
 * • Use the custom hook from Exercise 2
 *
 * ============================================================================
 *
 * Bonus (Optional)
 *
 * If time permits, implement one or more of the following:
 *
 * • Sort deployments by Scheduled Date
 *
 * • Display deployment counts grouped by Status
 *
 * • Display the number of filtered deployments
 *
 * • Highlight the matched search text
 *
 * ============================================================================
 *
 * Notes
 *
 * • You may create additional components if needed.
 *
 * • You may extend the custom hook created in Exercise 2.
 *
 * • Focus on clean architecture over visual appearance.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * ✓ React
 * ✓ React Query
 * ✓ TypeScript
 * ✓ Component Composition
 * ✓ Hooks
 * ✓ State Management
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { getDeployments } from "@/api/diploymentApi";
import { Button } from "@/components/ui/button";
import type { Deployment, Status, StatusFilter } from "@/types";

import DeploymentCard from "./example1";
import { useDeploymentFilters } from "./example2";

/**
 * TODO
 *
 * Build the Deployment Queue page.
 *
 * Expected flow:
 *
 * React Query
 *        ↓
 * Deployment Data
 *        ↓
 * useDeploymentSearch()
 *        ↓
 * DeploymentCard[]
 */

const STATUS_FILTERS: StatusFilter[] = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
  "Failed",
];

const STATUS_COUNT_KEYS: Status[] = [
  "Pending",
  "In Progress",
  "Completed",
  "Failed",
];

function getStatusCounts(deployments: Deployment[]) {
  return STATUS_COUNT_KEYS.reduce(
    (counts, status) => {
      counts[status] = deployments.filter(
        (deployment) => deployment.status === status
      ).length;
      return counts;
    },
    { Pending: 0, "In Progress": 0, Completed: 0, Failed: 0 } as Record<
      Status,
      number
    >
  );
}

export default function Example3() {
  // This is a placeholder component to demonstrate the usage of the useQuery hook.
  // You can use the useQuery hook to fetch deployments and display them using the DeploymentCard component.

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });

  const deployments = data ?? [];
  const {
    search,
    setSearch,
    status,
    setStatus,
    filteredDeployments,
  } = useDeploymentFilters(deployments);

  const statusCounts = useMemo(
    () => getStatusCounts(deployments),
    [deployments]
  );

  return (
    <div className="container mx-auto flex h-full flex-col gap-6 overflow-hidden p-6">
      <header className="shrink-0 space-y-1">
        <h1 className="text-2xl font-semibold">Deployment Queue</h1>
        <p className="text-muted-foreground text-sm">
          Total Deployments: {isPending ? "—" : deployments.length}
        </p>
        {!isPending && !isError && (
          <p className="text-muted-foreground text-sm">
            Showing {filteredDeployments.length} of {deployments.length}
          </p>
        )}
      </header>

      <div className="flex shrink-0 flex-col gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by application name"
          aria-label="Search by application name"
          className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full max-w-md rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
        />

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <Button
              key={filter}
              type="button"
              size="sm"
              variant={status === filter ? "default" : "outline"}
              onClick={() => setStatus(filter)}
            >
              {filter}
              {filter !== "All" ? ` (${statusCounts[filter]})` : ""}
            </Button>
          ))}
        </div>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {isPending && (
          <p className="text-muted-foreground text-sm">Loading deployments...</p>
        )}

        {isError && (
          <p className="text-destructive text-sm">
            {error instanceof Error
              ? error.message
              : "Failed to load deployments."}
          </p>
        )}

        {!isPending && !isError && filteredDeployments.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No deployments match your search or filter.
          </p>
        )}

        {!isPending && !isError && filteredDeployments.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 p-1">
            {filteredDeployments.map((deployment) => (
              <li key={deployment.id} className="min-w-0">
                <DeploymentCard deployment={deployment} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}