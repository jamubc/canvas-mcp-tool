import { z } from 'zod';
import { CanvasAPIClient } from '../api/canvas-client.js';
import { CanvasDashboardCard, CanvasCalendarEvent } from '../types/canvas.js';
export declare const GetDashboardCardsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const ListCalendarEventsSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<["event", "assignment"]>>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodString>;
    context_codes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    excludes: z.ZodOptional<z.ZodArray<z.ZodEnum<["assignment", "description", "child_events"]>, "many">>;
    includes: z.ZodOptional<z.ZodArray<z.ZodEnum<["web_conference"]>, "many">>;
    important_dates: z.ZodOptional<z.ZodBoolean>;
    blackout_date: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type?: "event" | "assignment" | undefined;
    includes?: "web_conference"[] | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    context_codes?: string[] | undefined;
    excludes?: ("assignment" | "description" | "child_events")[] | undefined;
    important_dates?: boolean | undefined;
    blackout_date?: boolean | undefined;
}, {
    type?: "event" | "assignment" | undefined;
    includes?: "web_conference"[] | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    context_codes?: string[] | undefined;
    excludes?: ("assignment" | "description" | "child_events")[] | undefined;
    important_dates?: boolean | undefined;
    blackout_date?: boolean | undefined;
}>;
export declare class DashboardTools {
    private client;
    constructor(client: CanvasAPIClient);
    getDashboardCards(_params: z.infer<typeof GetDashboardCardsSchema>): Promise<CanvasDashboardCard[]>;
    listCalendarEvents(params: z.infer<typeof ListCalendarEventsSchema>): Promise<CanvasCalendarEvent[]>;
}
//# sourceMappingURL=dashboard.d.ts.map