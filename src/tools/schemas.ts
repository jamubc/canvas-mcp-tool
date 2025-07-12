/**
 * Valibot schemas for Canvas API tool parameters
 * Optimized using Valibot composition patterns for maximum code reuse and performance
 */

import * as v from 'valibot';

// Base Canvas entity schemas (DRY principle)
export const BaseCanvasIdSchema = v.pipe(v.number(), v.minValue(1), v.integer());
export const CourseIdSchema = BaseCanvasIdSchema;
export const AssignmentIdSchema = BaseCanvasIdSchema;
export const ModuleIdSchema = BaseCanvasIdSchema;
export const UserIdSchema = v.union([BaseCanvasIdSchema, v.literal('self')]);

// Include option constants for reusability
const COURSE_INCLUDES = ['syllabus_body', 'term', 'course_progress', 'total_students', 'teachers'] as const;
const ASSIGNMENT_INCLUDES = ['submission', 'assignment_visibility', 'all_dates', 'overrides', 'observed_users'] as const;
const MODULE_INCLUDES = ['items', 'content_details'] as const;
const ENROLLMENT_TYPES = ['teacher', 'student', 'ta', 'observer', 'designer'] as const;
const ENROLLMENT_STATES = ['active', 'invited', 'completed'] as const;
const ASSIGNMENT_BUCKETS = ['past', 'overdue', 'undated', 'ungraded', 'unsubmitted', 'upcoming', 'future'] as const;
const ASSIGNMENT_ORDER = ['position', 'name', 'due_at'] as const;
const CONVERSATION_SCOPES = ['unread', 'starred', 'archived'] as const;
const CALENDAR_TYPES = ['event', 'assignment'] as const;

// Reusable include schemas
export const CourseIncludeSchema = v.optional(v.array(v.picklist(COURSE_INCLUDES)));
export const AssignmentIncludeSchema = v.optional(v.array(v.picklist(ASSIGNMENT_INCLUDES)));
export const ModuleIncludeSchema = v.optional(v.array(v.picklist(MODULE_INCLUDES)));

// Base entity object schemas for composition
const BaseCourseSchema = v.object({ course_id: CourseIdSchema });
const BaseAssignmentSchema = v.object({ 
  course_id: CourseIdSchema,
  assignment_id: AssignmentIdSchema 
});
const BaseModuleSchema = v.object({
  course_id: CourseIdSchema,
  module_id: ModuleIdSchema
});
const BaseAccountSchema = v.object({ account_id: BaseCanvasIdSchema });

// Courses schemas
export const ListCoursesSchema = v.object({
  enrollment_type: v.optional(v.picklist(ENROLLMENT_TYPES)),
  enrollment_state: v.optional(v.picklist(ENROLLMENT_STATES)),
  include: CourseIncludeSchema
});

export const GetCourseSchema = v.intersect([
  BaseCourseSchema,
  v.object({ include: CourseIncludeSchema })
]);

export const GetSyllabusSchema = BaseCourseSchema;

// Assignments schemas
export const ListAssignmentsSchema = v.intersect([
  BaseCourseSchema,
  v.object({
    include: AssignmentIncludeSchema,
    search_term: v.optional(v.string()),
    bucket: v.optional(v.picklist(ASSIGNMENT_BUCKETS)),
    order_by: v.optional(v.picklist(ASSIGNMENT_ORDER))
  })
]);

export const GetAssignmentSchema = v.intersect([
  BaseAssignmentSchema,
  v.object({ include: AssignmentIncludeSchema })
]);

// Submissions schemas
export const GetSubmissionsSchema = BaseAssignmentSchema;

export const GetSubmissionSchema = v.intersect([
  BaseAssignmentSchema,
  v.object({ user_id: UserIdSchema })
]);

// Files schemas
export const ListFilesSchema = v.intersect([
  BaseCourseSchema,
  v.object({ folder_id: v.optional(BaseCanvasIdSchema) })
]);

export const GetFileSchema = v.object({ file_id: BaseCanvasIdSchema });

// Dashboard schemas
export const GetDashboardCardsSchema = v.object({});

// Calendar schemas
export const ListCalendarEventsSchema = v.object({
  type: v.optional(v.picklist(CALENDAR_TYPES)),
  start_date: v.optional(v.pipe(v.string(), v.isoDate())),
  end_date: v.optional(v.pipe(v.string(), v.isoDate())),
  context_codes: v.optional(v.array(v.string()))
});

// User profile schemas
export const GetUserProfileSchema = v.object({
  user_id: v.optional(UserIdSchema)
});

// Grades schemas
export const GetCourseGradesSchema = BaseCourseSchema;
export const GetUserGradesSchema = v.object({});

// Modules schemas
export const ListModulesSchema = v.intersect([
  BaseCourseSchema,
  v.object({ include: ModuleIncludeSchema })
]);

export const GetModuleSchema = v.intersect([
  BaseModuleSchema,
  v.object({ include: ModuleIncludeSchema })
]);

export const GetModuleItemSchema = v.intersect([
  BaseModuleSchema,
  v.object({ item_id: BaseCanvasIdSchema })
]);

// Content pages schemas
export const ListPagesSchema = BaseCourseSchema;

export const GetPageSchema = v.intersect([
  BaseCourseSchema,
  v.object({ page_url: v.string() })
]);

// Conversations schemas
export const ListConversationsSchema = v.object({
  scope: v.optional(v.picklist(CONVERSATION_SCOPES)),
  filter: v.optional(v.array(v.string()))
});

export const GetConversationSchema = v.object({
  conversation_id: BaseCanvasIdSchema
});

export const CreateConversationSchema = v.object({
  recipients: v.array(v.string()),
  subject: v.string(),
  body: v.string(),
  group_conversation: v.optional(v.boolean()),
  attachment_ids: v.optional(v.array(v.number()))
});

// Notifications schema
export const ListNotificationsSchema = v.object({
  include: v.optional(v.array(v.picklist(['unread_count'])))
});

// Discussions schemas
export const ListDiscussionTopicsSchema = BaseCourseSchema;

export const GetDiscussionTopicSchema = v.intersect([
  BaseCourseSchema,
  v.object({ topic_id: BaseCanvasIdSchema })
]);

// Announcements schema
export const ListAnnouncementsSchema = BaseCourseSchema;

// Quizzes schemas
export const ListQuizzesSchema = BaseCourseSchema;

export const GetQuizSchema = v.intersect([
  BaseCourseSchema,
  v.object({ quiz_id: BaseCanvasIdSchema })
]);

// Rubrics schemas
export const ListRubricsSchema = BaseCourseSchema;

export const GetRubricSchema = v.intersect([
  BaseCourseSchema,
  v.object({ rubric_id: BaseCanvasIdSchema })
]);

// Account management schemas
export const GetAccountSchema = BaseAccountSchema;
export const ListAccountCoursesSchema = BaseAccountSchema;

// Account reports schemas
export const GetAccountReportsSchema = BaseAccountSchema;
export const GetAccountReportSchema = v.intersect([
  BaseAccountSchema,
  v.object({
    report_type: v.string(),
    report_id: BaseCanvasIdSchema
  })
]);

// API Scopes schema
export const ListTokenScopesSchema = v.object({});

// Student courses schema
export const ListStudentCoursesSchema = v.object({});

// Upcoming assignments schema
export const GetUpcomingAssignmentsSchema = v.object({});