/**
 * Standard response type for server actions
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper to create a successful action result
 */
export function actionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

/**
 * Helper to create a failed action result
 */
export function actionError(error: string): ActionResult<never> {
  return { success: false, error };
}
