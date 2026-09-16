

/**
 * ============================================================================
 * Exercise 1 - Deployment Card
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Your team is building an internal Deployment Queue application used by
 * Release Engineers to monitor application deployments.
 *
 * A mock API response has been provided in src/data/MOCK_DATA.ts.
 *
 * In this exercise, your task is to build a reusable DeploymentCard component.
 *
 * ============================================================================
 *
 * ## Requirements

### 1. Component Setup

- Create a `DeploymentCard` component.
- Keep the provided imports unchanged.
- Use React with TypeScript.
- Use the existing Shadcn UI components:
  - Card
  - Badge
  - Button
  - Separator

---
### 2. Deployment Interface

Create the `Deployment` interface with the mockdata properties:
make sure 
environment: "Production" | "QA" | "Development" | "Staging";
status: "Pending" | "In Progress" | "Completed";
priority: "Low" | "Medium" | "High" | "Critical";



 * ============================================================================
 *
 * UI Requirements
 *
 * • Use the provided shadcn/ui components where appropriate.
 *
 * • Environment and Status should be displayed using badges.
 *
 * • Display a "advance to [next status]" button at the bottom of the card.
 *
 * • Use appropriate spacing and visual hierarchy.
 *
 * • The component should remain responsive.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • Use TypeScript.
 *
 * • Define appropriate interfaces/types.
 *
 * • Keep the component reusable.
 *
 * • Do not hardcode values.
 *
 * • Avoid unnecessary duplication.
 *
 * • Write clean, maintainable code.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * We will evaluate:
 *
 * ✓ React Fundamentals
 * ✓ Component Composition
 * ✓ TypeScript
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 *
 * Note
 *
 * This exercise focuses only on the DeploymentCard component.
 *
 * Additional requirements will be introduced in later exercises.
 *
 * ============================================================================
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Deployment, Environment, Status } from "@/types";

interface DeploymentCardProps {
  deployment: Deployment;
  onAdvance?: () => void;
}

const STATUS_FLOW: Record<Status, Status | null> = {
  Pending: "In Progress",
  "In Progress": "Completed",
  Completed: null,
  Failed: null,
};

const ENVIRONMENT_BADGE_VARIANT: Record<
  Environment,
  "destructive" | "secondary" | "outline"
> = {
  Production: "destructive",
  QA: "secondary",
  Development: "outline",
  Staging: "outline",
};

const STATUS_BADGE_VARIANT: Record<
  Status,
  "outline" | "default" | "secondary" | "destructive"
> = {
  Pending: "outline",
  "In Progress": "default",
  Completed: "secondary",
  Failed: "destructive",
};

function formatScheduledAt(isoDate: string) {
  return new Date(isoDate).toLocaleString();
}

const DeploymentCard = ({ deployment, onAdvance }: DeploymentCardProps) => {
  const nextStatus = STATUS_FLOW[deployment.status];
  const canAdvance = nextStatus !== null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between gap-2">
          <div className="space-y-1">
            <CardTitle>{deployment.application}</CardTitle>
            <CardDescription>{deployment.id}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={ENVIRONMENT_BADGE_VARIANT[deployment.environment]}>
              {deployment.environment}
            </Badge>
            <Badge variant={STATUS_BADGE_VARIANT[deployment.status]}>
              {deployment.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Detail label="Version" value={deployment.version} />
        <Detail label="Priority" value={deployment.priority} />
        <Detail label="Requested by" value={deployment.requestedBy} />
        <Detail label="Region" value={deployment.region} />
        <Detail
          label="Scheduled"
          value={formatScheduledAt(deployment.scheduledAt)}
        />
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          disabled={!canAdvance}
          onClick={onAdvance}
        >
          {canAdvance ? `Advance to ${nextStatus}` : "Completed"}
        </Button>
      </CardFooter>
    </Card>
  );
};

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="truncate font-medium">{value}</p>
    </div>
  );
}

export default DeploymentCard;
