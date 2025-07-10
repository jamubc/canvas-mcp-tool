import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError, } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { validateConfig, getCanvasClientConfig } from "./config/index.js";
import { CanvasAPIClient } from "./api/canvas-client.js";
import { CoursesTools, ListCoursesSchema, GetCourseSchema, GetCourseModulesSchema } from "./tools/courses.js";
import { AssignmentsTools, ListAssignmentsSchema, GetAssignmentSchema } from "./tools/assignments.js";
import { UsersTools, GetProfileSchema, ListUsersSchema } from "./tools/users.js";
import { DashboardTools, GetDashboardCardsSchema, ListCalendarEventsSchema } from "./tools/dashboard.js";
import { FilesTools, GetFileContentSchema, GetFileMetadataSchema } from "./tools/files.js";
import { createLogger } from "./utils/logger.js";
import { CanvasAPIError } from "./types/errors.js";
const logger = createLogger('Server');
// Validate configuration before starting
try {
    validateConfig();
}
catch (error) {
    console.error('Configuration error:', error);
    process.exit(1);
}
const server = new Server({
    name: "canvas-mcp-tool",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Initialize Canvas API client and tools
const canvasClient = new CanvasAPIClient(getCanvasClientConfig());
const coursesTools = new CoursesTools(canvasClient);
const assignmentsTools = new AssignmentsTools(canvasClient);
const usersTools = new UsersTools(canvasClient);
const dashboardTools = new DashboardTools(canvasClient);
const filesTools = new FilesTools(canvasClient);
// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // Course Management Tools
            {
                name: "list_courses",
                description: "List all courses the user is enrolled in",
                inputSchema: {
                    type: "object",
                    properties: {
                        enrollment_type: {
                            type: "string",
                            enum: ["teacher", "student", "ta", "observer", "designer"],
                            description: "Filter by enrollment type",
                        },
                        enrollment_state: {
                            type: "string",
                            enum: ["active", "invited", "completed"],
                            description: "Filter by enrollment state",
                        },
                        include: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["syllabus_body", "term", "course_progress", "total_students", "teachers"],
                            },
                            description: "Additional information to include",
                        },
                    },
                },
            },
            {
                name: "get_course",
                description: "Get details about a specific course",
                inputSchema: {
                    type: "object",
                    properties: {
                        course_id: {
                            type: "number",
                            description: "The ID of the course",
                        },
                        include: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["syllabus_body", "term", "course_progress", "total_students", "teachers"],
                            },
                            description: "Additional information to include",
                        },
                    },
                    required: ["course_id"],
                },
            },
            {
                name: "get_course_modules",
                description: "Get modules/content for a specific course",
                inputSchema: {
                    type: "object",
                    properties: {
                        course_id: {
                            type: "number",
                            description: "The ID of the course",
                        },
                        include: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["items", "content_details"],
                            },
                            description: "Additional information to include",
                        },
                    },
                    required: ["course_id"],
                },
            },
            // Assignment Tools
            {
                name: "list_assignments",
                description: "List assignments for a course",
                inputSchema: {
                    type: "object",
                    properties: {
                        course_id: {
                            type: "number",
                            description: "The ID of the course",
                        },
                        include: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["submission", "assignment_visibility", "all_dates", "overrides", "observed_users"],
                            },
                            description: "Additional information to include",
                        },
                        search_term: {
                            type: "string",
                            description: "Search assignments by name",
                        },
                        bucket: {
                            type: "string",
                            enum: ["past", "overdue", "undated", "ungraded", "unsubmitted", "upcoming", "future"],
                            description: "Filter assignments by bucket",
                        },
                        order_by: {
                            type: "string",
                            enum: ["position", "name", "due_at"],
                            description: "Order assignments by field",
                        },
                    },
                    required: ["course_id"],
                },
            },
            {
                name: "get_assignment",
                description: "Get details about a specific assignment",
                inputSchema: {
                    type: "object",
                    properties: {
                        course_id: {
                            type: "number",
                            description: "The ID of the course",
                        },
                        assignment_id: {
                            type: "number",
                            description: "The ID of the assignment",
                        },
                        include: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["submission", "assignment_visibility", "overrides", "observed_users"],
                            },
                            description: "Additional information to include",
                        },
                    },
                    required: ["course_id", "assignment_id"],
                },
            },
            // COMMENTED OUT FOR THIS RELEASE
            /*
            {
              name: "submit_assignment",
              description: "Submit an assignment",
              inputSchema: {
                type: "object",
                properties: {
                  course_id: {
                    type: "number",
                    description: "The ID of the course",
                  },
                  assignment_id: {
                    type: "number",
                    description: "The ID of the assignment",
                  },
                  submission_type: {
                    type: "string",
                    enum: ["online_text_entry", "online_url", "online_upload", "media_recording"],
                    description: "Type of submission",
                  },
                  body: {
                    type: "string",
                    description: "Text content for online_text_entry submissions",
                  },
                  url: {
                    type: "string",
                    description: "URL for online_url submissions",
                  },
                  file_ids: {
                    type: "array",
                    items: {
                      type: "number",
                    },
                    description: "File IDs for online_upload submissions",
                  },
                  media_comment_id: {
                    type: "string",
                    description: "Media comment ID for media_recording submissions",
                  },
                  media_comment_type: {
                    type: "string",
                    enum: ["audio", "video"],
                    description: "Type of media comment",
                  },
                },
                required: ["course_id", "assignment_id", "submission_type"],
              },
            },
            */
            // User/Profile Tools
            {
                name: "get_profile",
                description: "Get user profile information",
                inputSchema: {
                    type: "object",
                    properties: {
                        user_id: {
                            type: ["number", "string"],
                            description: "User ID or 'self' for current user",
                        },
                    },
                },
            },
            {
                name: "list_users",
                description: "List users in a course",
                inputSchema: {
                    type: "object",
                    properties: {
                        course_id: {
                            type: "number",
                            description: "The ID of the course",
                        },
                        search_term: {
                            type: "string",
                            description: "Search users by name or email",
                        },
                        enrollment_type: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["teacher", "student", "ta", "observer", "designer"],
                            },
                            description: "Filter by enrollment type",
                        },
                        enrollment_state: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["active", "invited", "rejected", "completed", "inactive"],
                            },
                            description: "Filter by enrollment state",
                        },
                        include: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["enrollments", "email", "avatar_url", "test_student"],
                            },
                            description: "Additional information to include",
                        },
                    },
                    required: ["course_id"],
                },
            },
            // Dashboard Tools
            {
                name: "get_dashboard_cards",
                description: "Get dashboard course cards",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "list_calendar_events",
                description: "List calendar events",
                inputSchema: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            enum: ["event", "assignment"],
                            description: "Filter by event type",
                        },
                        start_date: {
                            type: "string",
                            description: "Start date (ISO 8601 format)",
                        },
                        end_date: {
                            type: "string",
                            description: "End date (ISO 8601 format)",
                        },
                        context_codes: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                            description: "Context codes (e.g., 'course_123')",
                        },
                        excludes: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["assignment", "description", "child_events"],
                            },
                            description: "Information to exclude",
                        },
                        includes: {
                            type: "array",
                            items: {
                                type: "string",
                                enum: ["web_conference"],
                            },
                            description: "Additional information to include",
                        },
                        important_dates: {
                            type: "boolean",
                            description: "Only include important dates",
                        },
                        blackout_date: {
                            type: "boolean",
                            description: "Only include blackout dates",
                        },
                    },
                },
            },
            // File Tools
            {
                name: "get_file_metadata",
                description: "Get metadata about a Canvas file",
                inputSchema: {
                    type: "object",
                    properties: {
                        file_id: {
                            type: "number",
                            description: "The ID of the file",
                        },
                    },
                    required: ["file_id"],
                },
            },
            {
                name: "get_file_content",
                description: "Get the text content of a Canvas file (PDF, DOCX, TXT)",
                inputSchema: {
                    type: "object",
                    properties: {
                        file_id: {
                            type: "number",
                            description: "The ID of the file",
                        },
                        extract_text: {
                            type: "boolean",
                            description: "Extract text content from the file (default: true)",
                        },
                    },
                    required: ["file_id"],
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            // Course Management Tools
            case "list_courses": {
                const params = ListCoursesSchema.parse(args);
                const courses = await coursesTools.listCourses(params);
                // Handle large responses
                const responseText = JSON.stringify(courses, null, 2);
                const maxLength = 24000;
                if (responseText.length > maxLength) {
                    const limitedCourses = courses.slice(0, 20);
                    const summary = {
                        total_courses: courses.length,
                        showing: limitedCourses.length,
                        message: `Response too large. Showing first ${limitedCourses.length} of ${courses.length} courses. Use filters like 'enrollment_type' or 'enrollment_state' to narrow results.`,
                        courses: limitedCourses.map(c => ({
                            id: c.id,
                            name: c.name,
                            course_code: c.course_code,
                            workflow_state: c.workflow_state,
                            start_at: c.start_at,
                            end_at: c.end_at
                        }))
                    };
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(summary, null, 2),
                            },
                        ],
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: responseText,
                        },
                    ],
                };
            }
            case "get_course": {
                const params = GetCourseSchema.parse(args);
                const course = await coursesTools.getCourse(params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(course, null, 2),
                        },
                    ],
                };
            }
            case "get_course_modules": {
                const params = GetCourseModulesSchema.parse(args);
                const modules = await coursesTools.getCourseModules(params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(modules, null, 2),
                        },
                    ],
                };
            }
            // Assignment Tools
            case "list_assignments": {
                const params = ListAssignmentsSchema.parse(args);
                const assignments = await assignmentsTools.listAssignments(params);
                // Handle large responses by limiting output
                const responseText = JSON.stringify(assignments, null, 2);
                const maxLength = 24000; // Leave some buffer under 25000 limit
                if (responseText.length > maxLength) {
                    // Return a summary with limited assignments
                    const limitedAssignments = assignments.slice(0, 10);
                    const summary = {
                        total_assignments: assignments.length,
                        showing: limitedAssignments.length,
                        message: `Response too large. Showing first ${limitedAssignments.length} of ${assignments.length} assignments. Use filters like 'bucket' or 'search_term' to narrow results.`,
                        assignments: limitedAssignments.map(a => ({
                            id: a.id,
                            name: a.name,
                            due_at: a.due_at,
                            points_possible: a.points_possible,
                            submission_types: a.submission_types,
                            has_submitted_submissions: a.has_submitted_submissions,
                            html_url: a.html_url
                        }))
                    };
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(summary, null, 2),
                            },
                        ],
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: responseText,
                        },
                    ],
                };
            }
            case "get_assignment": {
                const params = GetAssignmentSchema.parse(args);
                const assignment = await assignmentsTools.getAssignment(params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(assignment, null, 2),
                        },
                    ],
                };
            }
            // COMMENTED OUT FOR SAFETY - DO NOT ENABLE WITHOUT EXPLICIT PERMISSION
            /*
            case "submit_assignment": {
              const params = SubmitAssignmentSchema.parse(args);
              const submission = await assignmentsTools.submitAssignment(params);
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(submission, null, 2),
                  },
                ],
              };
            }
            */
            // User/Profile Tools
            case "get_profile": {
                const params = GetProfileSchema.parse(args);
                const profile = await usersTools.getProfile(params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(profile, null, 2),
                        },
                    ],
                };
            }
            case "list_users": {
                const params = ListUsersSchema.parse(args);
                const users = await usersTools.listUsers(params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(users, null, 2),
                        },
                    ],
                };
            }
            // Dashboard Tools
            case "get_dashboard_cards": {
                const params = GetDashboardCardsSchema.parse(args);
                const cards = await dashboardTools.getDashboardCards(params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(cards, null, 2),
                        },
                    ],
                };
            }
            case "list_calendar_events": {
                const params = ListCalendarEventsSchema.parse(args);
                const events = await dashboardTools.listCalendarEvents(params);
                // Handle large responses
                const responseText = JSON.stringify(events, null, 2);
                const maxLength = 24000;
                if (responseText.length > maxLength) {
                    const limitedEvents = events.slice(0, 20);
                    const summary = {
                        total_events: events.length,
                        showing: limitedEvents.length,
                        message: `Response too large. Showing first ${limitedEvents.length} of ${events.length} events. Use date filters or context_codes to narrow results.`,
                        events: limitedEvents.map(e => ({
                            id: e.id,
                            title: e.title,
                            start_at: e.start_at,
                            end_at: e.end_at,
                            type: e.type,
                            context_code: e.context_code,
                            workflow_state: e.workflow_state,
                            html_url: e.html_url
                        }))
                    };
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify(summary, null, 2),
                            },
                        ],
                    };
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: responseText,
                        },
                    ],
                };
            }
            // File Tools
            case "get_file_metadata": {
                const params = GetFileMetadataSchema.parse(args);
                const metadata = await filesTools.getFileMetadata(params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(metadata, null, 2),
                        },
                    ],
                };
            }
            case "get_file_content": {
                const params = GetFileContentSchema.parse(args);
                const content = await filesTools.getFileContent(params);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(content, null, 2),
                        },
                    ],
                };
            }
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
    }
    catch (error) {
        logger.error(`Error handling tool ${name}`, error);
        if (error instanceof z.ZodError) {
            throw new McpError(ErrorCode.InvalidParams, `Invalid parameters: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
        }
        if (error instanceof CanvasAPIError) {
            throw new McpError(ErrorCode.InternalError, `Canvas API error (${error.statusCode}): ${error.message}`);
        }
        if (error instanceof McpError) {
            throw error;
        }
        throw new McpError(ErrorCode.InternalError, error instanceof Error ? error.message : 'An unknown error occurred');
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("Canvas MCP server is running");
}
main().catch((error) => {
    logger.error("Server failed to start", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map