export class RequiresProPlanError extends Error {
  constructor(message = "This action requires a pro plan") {
    super(message)
  }
}

export class RequiresActivePlanError extends Error {
  constructor(message = "This action requires an active plan") {
    super(message)
  }
}

export class MaximumPlanResourcesError extends Error {
  constructor(message = "You have exhausted your plan allocated resources") {
    super(message)
  }
}

