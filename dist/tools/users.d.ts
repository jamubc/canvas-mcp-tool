import { z } from 'zod';
import { CanvasAPIClient } from '../api/canvas-client.js';
import { CanvasUser } from '../types/canvas.js';
export declare const GetProfileSchema: z.ZodObject<{
    user_id: z.ZodDefault<z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodLiteral<"self">]>>>;
}, "strip", z.ZodTypeAny, {
    user_id: number | "self";
}, {
    user_id?: number | "self" | undefined;
}>;
export declare const ListUsersSchema: z.ZodObject<{
    course_id: z.ZodNumber;
    search_term: z.ZodOptional<z.ZodString>;
    enrollment_type: z.ZodOptional<z.ZodArray<z.ZodEnum<["teacher", "student", "ta", "observer", "designer"]>, "many">>;
    enrollment_state: z.ZodOptional<z.ZodArray<z.ZodEnum<["active", "invited", "rejected", "completed", "inactive"]>, "many">>;
    include: z.ZodOptional<z.ZodArray<z.ZodEnum<["enrollments", "email", "avatar_url", "test_student"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    course_id: number;
    enrollment_type?: ("teacher" | "student" | "ta" | "observer" | "designer")[] | undefined;
    enrollment_state?: ("completed" | "active" | "invited" | "inactive" | "rejected")[] | undefined;
    include?: ("enrollments" | "email" | "avatar_url" | "test_student")[] | undefined;
    search_term?: string | undefined;
}, {
    course_id: number;
    enrollment_type?: ("teacher" | "student" | "ta" | "observer" | "designer")[] | undefined;
    enrollment_state?: ("completed" | "active" | "invited" | "inactive" | "rejected")[] | undefined;
    include?: ("enrollments" | "email" | "avatar_url" | "test_student")[] | undefined;
    search_term?: string | undefined;
}>;
export declare class UsersTools {
    private client;
    constructor(client: CanvasAPIClient);
    getProfile(params: z.infer<typeof GetProfileSchema>): Promise<CanvasUser>;
    listUsers(params: z.infer<typeof ListUsersSchema>): Promise<CanvasUser[]>;
}
//# sourceMappingURL=users.d.ts.map