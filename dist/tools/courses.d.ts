import { z } from 'zod';
import { CanvasAPIClient } from '../api/canvas-client.js';
import { CanvasCourse } from '../types/canvas.js';
export declare const ListCoursesSchema: z.ZodObject<{
    enrollment_type: z.ZodOptional<z.ZodEnum<["teacher", "student", "ta", "observer", "designer"]>>;
    enrollment_state: z.ZodOptional<z.ZodEnum<["active", "invited", "completed"]>>;
    include: z.ZodOptional<z.ZodArray<z.ZodEnum<["syllabus_body", "term", "course_progress", "total_students", "teachers"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    enrollment_type?: "teacher" | "student" | "ta" | "observer" | "designer" | undefined;
    enrollment_state?: "completed" | "active" | "invited" | undefined;
    include?: ("syllabus_body" | "term" | "course_progress" | "total_students" | "teachers")[] | undefined;
}, {
    enrollment_type?: "teacher" | "student" | "ta" | "observer" | "designer" | undefined;
    enrollment_state?: "completed" | "active" | "invited" | undefined;
    include?: ("syllabus_body" | "term" | "course_progress" | "total_students" | "teachers")[] | undefined;
}>;
export declare const GetCourseSchema: z.ZodObject<{
    course_id: z.ZodNumber;
    include: z.ZodOptional<z.ZodArray<z.ZodEnum<["syllabus_body", "term", "course_progress", "total_students", "teachers"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    course_id: number;
    include?: ("syllabus_body" | "term" | "course_progress" | "total_students" | "teachers")[] | undefined;
}, {
    course_id: number;
    include?: ("syllabus_body" | "term" | "course_progress" | "total_students" | "teachers")[] | undefined;
}>;
export declare const GetCourseModulesSchema: z.ZodObject<{
    course_id: z.ZodNumber;
    include: z.ZodOptional<z.ZodArray<z.ZodEnum<["items", "content_details"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    course_id: number;
    include?: ("items" | "content_details")[] | undefined;
}, {
    course_id: number;
    include?: ("items" | "content_details")[] | undefined;
}>;
export declare class CoursesTools {
    private client;
    constructor(client: CanvasAPIClient);
    listCourses(params: z.infer<typeof ListCoursesSchema>): Promise<CanvasCourse[]>;
    getCourse(params: z.infer<typeof GetCourseSchema>): Promise<CanvasCourse>;
    getCourseModules(params: z.infer<typeof GetCourseModulesSchema>): Promise<any[]>;
}
//# sourceMappingURL=courses.d.ts.map