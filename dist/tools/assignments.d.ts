import { z } from 'zod';
import { CanvasAPIClient } from '../api/canvas-client.js';
import { CanvasAssignment, CanvasSubmission } from '../types/canvas.js';
export declare const ListAssignmentsSchema: z.ZodObject<{
    course_id: z.ZodNumber;
    include: z.ZodOptional<z.ZodArray<z.ZodEnum<["submission", "assignment_visibility", "all_dates", "overrides", "observed_users"]>, "many">>;
    search_term: z.ZodOptional<z.ZodString>;
    override_assignment_dates: z.ZodOptional<z.ZodBoolean>;
    needs_grading_count_by_section: z.ZodOptional<z.ZodBoolean>;
    bucket: z.ZodOptional<z.ZodEnum<["past", "overdue", "undated", "ungraded", "unsubmitted", "upcoming", "future"]>>;
    assignment_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    order_by: z.ZodOptional<z.ZodEnum<["position", "name", "due_at"]>>;
}, "strip", z.ZodTypeAny, {
    course_id: number;
    include?: ("submission" | "assignment_visibility" | "all_dates" | "overrides" | "observed_users")[] | undefined;
    search_term?: string | undefined;
    override_assignment_dates?: boolean | undefined;
    needs_grading_count_by_section?: boolean | undefined;
    bucket?: "unsubmitted" | "past" | "overdue" | "undated" | "ungraded" | "upcoming" | "future" | undefined;
    assignment_ids?: number[] | undefined;
    order_by?: "position" | "name" | "due_at" | undefined;
}, {
    course_id: number;
    include?: ("submission" | "assignment_visibility" | "all_dates" | "overrides" | "observed_users")[] | undefined;
    search_term?: string | undefined;
    override_assignment_dates?: boolean | undefined;
    needs_grading_count_by_section?: boolean | undefined;
    bucket?: "unsubmitted" | "past" | "overdue" | "undated" | "ungraded" | "upcoming" | "future" | undefined;
    assignment_ids?: number[] | undefined;
    order_by?: "position" | "name" | "due_at" | undefined;
}>;
export declare const GetAssignmentSchema: z.ZodObject<{
    course_id: z.ZodNumber;
    assignment_id: z.ZodNumber;
    include: z.ZodOptional<z.ZodArray<z.ZodEnum<["submission", "assignment_visibility", "overrides", "observed_users"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    course_id: number;
    assignment_id: number;
    include?: ("submission" | "assignment_visibility" | "overrides" | "observed_users")[] | undefined;
}, {
    course_id: number;
    assignment_id: number;
    include?: ("submission" | "assignment_visibility" | "overrides" | "observed_users")[] | undefined;
}>;
export declare const SubmitAssignmentSchema: z.ZodObject<{
    course_id: z.ZodNumber;
    assignment_id: z.ZodNumber;
    submission_type: z.ZodEnum<["online_text_entry", "online_url", "online_upload", "media_recording"]>;
    body: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    file_ids: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    media_comment_id: z.ZodOptional<z.ZodString>;
    media_comment_type: z.ZodOptional<z.ZodEnum<["audio", "video"]>>;
}, "strip", z.ZodTypeAny, {
    course_id: number;
    assignment_id: number;
    submission_type: "online_text_entry" | "online_url" | "online_upload" | "media_recording";
    url?: string | undefined;
    body?: string | undefined;
    file_ids?: number[] | undefined;
    media_comment_id?: string | undefined;
    media_comment_type?: "audio" | "video" | undefined;
}, {
    course_id: number;
    assignment_id: number;
    submission_type: "online_text_entry" | "online_url" | "online_upload" | "media_recording";
    url?: string | undefined;
    body?: string | undefined;
    file_ids?: number[] | undefined;
    media_comment_id?: string | undefined;
    media_comment_type?: "audio" | "video" | undefined;
}>;
export declare class AssignmentsTools {
    private client;
    constructor(client: CanvasAPIClient);
    listAssignments(params: z.infer<typeof ListAssignmentsSchema>): Promise<CanvasAssignment[]>;
    getAssignment(params: z.infer<typeof GetAssignmentSchema>): Promise<CanvasAssignment>;
    submitAssignment(params: z.infer<typeof SubmitAssignmentSchema>): Promise<CanvasSubmission>;
}
//# sourceMappingURL=assignments.d.ts.map