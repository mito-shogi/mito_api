import type { Bindings } from '../bindings'

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
export const scheduled = async (event: ScheduledController, env: Bindings, ctx: ExecutionContext): Promise<void> => {
  switch (event.cron) {
    case '0 0 * * *':
      break
    default:
      break
  }
}
