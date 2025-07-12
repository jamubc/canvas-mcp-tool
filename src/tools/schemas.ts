/**
 * Valibot schemas for Canvas API tool parameters
 * Following KISS principle - simple, flat schemas without unnecessary nesting
 */

import * as v from 'valibot';

// Common schemas used across multiple tools
export const CourseIdSchema = v.integer({ min: 1 });
export const UserIdSchema = v.union([v.integer({ min: 1 }), v.literal('self')]);
export const OptionalIncludeSchema = v.optional(v.array(v.string()));

// Courses schemas
export const ListCoursesSchema = v.object({
  enrollment_type: v.optional(v.picklist(['teacher', 'student', 'ta', 'observer', 'designer'])),
  enrollment_state: v.optional(v.picklist(['active', 'invited', 'completed'])),
  include: v.optional(v.array(v.picklist(['syllabus_body', 'term', 'course_progress', 'total_students', 'teachers'])))
});

export const GetCourseSchema = v.object({
  course_id: CourseIdSchema,
  include: v.optional(v.array(v.picklist(['syllabus_body', 'term', 'course_progress', 'total_students', 'teachers'])))
});

// Assignments schemas
export const ListAssignmentsSchema = v.object({
  course_id: CourseIdSchema,
  include: v.optional(v.array(v.picklist(['submission', 'assignment_visibility', 'all_dates', 'overrides', 'observed_users']))),
  search_term: v.optional(v.string()),
  bucket: v.optional(v.picklist(['past', 'overdue', 'undated', 'ungraded', 'unsubmitted', 'upcoming', 'future'])),
  order_by: v.optional(v.picklist(['position', 'name', 'due_at']))
});

export const GetAssignmentSchema = v.object({
  course_id: CourseIdSchema,
assignment_id: v.integer({ min: 1 }),
  include: v.optional(v.array(v.picklist(['submission', 'assignment_visibility', 'overrides', 'observed_users'])))
});

// Submissions schemas
export const GetSubmissionsSchema = v.object({
  course_id: CourseIdSchema,
assignment_id: v.integer({ min: 1 })
});

export const GetSubmissionSchema = v.object({
  course_id: CourseIdSchema,
assignment_id: v.integer({ min: 1 }),
  user_id: UserIdSchema
});

// Files schemas
export const ListFilesSchema = v.object({
  course_id: CourseIdSchema,
folder_id: v.optional(v.integer({ min: 1 }))
});

export const GetFileSchema = v.object({
file_id: v.integer({ min: 1 })
});

// Dashboard schemas
export const GetDashboardCardsSchema = v.object({});

// Calendar schemas
export const ListCalendarEventsSchema = v.object({
  type: v.optional(v.picklist(['event', 'assignment'])),
  start_date: v.optional(v.pipe(v.string(), v.isoDate())),
  end_date: v.optional(v.pipe(v.string(), v.isoDate())),
  context_codes: v.optional(v.array(v.string()))
});

// User profile schemas
export const GetUserProfileSchema = v.object({
  user_id: v.optional(UserIdSchema)
});

// Grades schemas
export const GetCourseGradesSchema = v.object({
  course_id: CourseIdSchema
});

export const GetUserGradesSchema = v.object({});

// Modules schemas
export const ListModulesSchema = v.object({
  course_id: CourseIdSchema,
  include: v.optional(v.array(v.picklist(['items', 'content_details'])))
});

export const GetModuleSchema = v.object({
  course_id: CourseIdSchema,
module_id: v.integer({ min: 1 }),
  include: v.optional(v.array(v.picklist(['items', 'content_details'])))
});

export const GetModuleItemSchema = v.object({
  course_id: CourseIdSchema,
  module_id: v.integer({ min: 1 }),
item_id: v.integer({ min: 1 })
});

// Content pages schemas
export const ListPagesSchema = v.object({
  course_id: CourseIdSchema
});

export const GetPageSchema = v.object({
  course_id: CourseIdSchema,
  page_url: v.string()
});

// Syllabus schema
export const GetSyllabusSchema = v.object({
  course_id: CourseIdSchema
});

// Conversations schemas
export const ListConversationsSchema = v.object({
  scope: v.optional(v.picklist(['unread', 'starred', 'archived'])),
  filter: v.optional(v.array(v.string()))
});

export const GetConversationSchema = v.object({
  conversation_id: v.integer({ min: 1 })
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
export const ListDiscussionTopicsSchema = v.object({
  course_id: CourseIdSchema
});

export const GetDiscussionTopicSchema = v.object({
  course_id: CourseIdSchema,
  topic_id: v.integer({ min: 1 })
});

// Announcements schema
export const ListAnnouncementsSchema = v.object({
  course_id: CourseIdSchema
});

// Quizzes schemas
export const ListQuizzesSchema = v.object({
  course_id: CourseIdSchema
});

export const GetQuizSchema = v.object({
  course_id: CourseIdSchema,
  quiz_id: v.integer({ min: 1 })
});

// Rubrics schemas
export const ListRubricsSchema = v.object({
  course_id: CourseIdSchema
});

export const GetRubricSchema = v.object({
  course_id: CourseIdSchema,
rubric_id: v.integer({ min: 1 })
});

// Account management schemas
export const GetAccountSchema = v.object({ account_id: v.integer({ min: 1 }) });

export const ListAccountCoursesSchema = v.object({ account_id: v.integer({ min: 1 }) });

// Account reports schemas
export const GetAccountReportsSchema = v.object({ account_id: v.integer({ min: 1 }) });
export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
  report_id: v.integer({ min: 1 }),
});

// API Scopes schema
export const ListTokenScopesSchema = v.object({});

// Student courses schema
export const ListStudentCoursesSchema = v.object({});

// Upcoming assignments schema
export const GetUpcomingAssignmentsSchema = v.object({});
export const GetAccountSchema = v.object({
  account_id: v.integer({ min: 1 })
});

export const ListAccountCoursesSchema = v.object({
  account_id: v.integer({ min: 1 })
});

// Account reports schemas
export const GetAccountReportsSchema = v.object({
  account_id: v.integer({ min: 1 })
});

export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
  report_id: v.integer({ min: 1 }),
});

// API Scopes schema
export const ListTokenScopesSchema = v.object({});

// Student courses schema
export const ListStudentCoursesSchema = v.object({});

// Upcoming assignments schema
export const GetUpcomingAssignmentsSchema = v.object({});
export const GetAccountSchema = v.object({ account_id: v.integer({ min: 1 }) });
export const ListAccountCoursesSchema = v.object({ account_id: v.integer({ min: 1 }) });

// Account reports schemas
export const GetAccountReportsSchema = v.object({ account_id: v.integer({ min: 1 }) });
export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
  report_id: v.integer({ min: 1 }),
});

// API Scopes schema
export const ListTokenScopesSchema = v.object({});

// Student courses schema
export const ListStudentCoursesSchema = v.object({});

// Upcoming assignments schema
export const GetUpcomingAssignmentsSchema = v.object({});
export const GetAccountSchema = v.object({ account_id: v.integer({ min: 1 }) });

export const ListAccountCoursesSchema = v.object({ account_id: v.integer({ min: 1 }) });

// Account reports schemas
export const GetAccountReportsSchema = v.object({ account_id: v.integer({ min: 1 }) });

export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
  report_id: v.integer({ min: 1 }),
});

// API Scopes schema
export const ListTokenScopesSchema = v.object({});

// Student courses schema
export const ListStudentCoursesSchema = v.object({});

// Upcoming assignments schema
export const GetUpcomingAssignmentsSchema = v.object({});
export const GetAccountSchema = v.object({ account_id: v.integer({ min: 1 }) });

export const ListAccountCoursesSchema = v.object({ account_id: v.integer({ min: 1 }) });

// Account reports schemas
export const GetAccountReportsSchema = v.object({ account_id: v.integer({ min: 1 }) });
export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
  report_id: v.integer({ min: 1 }),
});

// API Scopes schema
export const ListTokenScopesSchema = v.object({});

// Student courses schema
export const ListStudentCoursesSchema = v.object({});

// Upcoming assignments schema
export const GetUpcomingAssignmentsSchema = v.object({});
export const GetAccountSchema = v.object({
  account_id: v.integer({ min: 1 })
});

export const ListAccountCoursesSchema = v.object({
  account_id: v.integer({ min: 1 })
});

// Account reports schemas
export const GetAccountReportsSchema = v.object({
  account_id: v.integer({ min: 1 })
});

export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
  report_id: v.integer({ min: 1 })
});

// API Scopes schema
export const GetAccountSchema = v.object({
account_id: v.integer({ min: 1 })
});

export const ListAccountCoursesSchema = v.object({
  account_id: v.integer({ min: 1 })
});

// Account reports schemas
export const GetAccountReportsSchema = v.object({
  account_id: v.integer({ min: 1 })
});

export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
  report_id: v.integer({ min: 1 })
});
  account_id: v.integer({ min: 1 })
});

export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
  report_id: v.integer({ min: 1 })
});
export const GetAccountReportsSchema = v.object({
  account_id: v.integer({ min: 1 })
});
  account_id: v.integer({ min: 1 })
});
  account_id: v.pipe(v.number(), v.integer(), v.minValue(1))
});

export const GetAccountReportSchema = v.object({
  account_id: v.integer({ min: 1 }),
  account_id: v.integer({ min: 1 }),
  report_type: v.string(),
report_id: v.integer({ min: 1 })
});

// API Scopes schema
export const ListTokenScopesSchema = v.object({});

// Student courses schema
export const ListStudentCoursesSchema = v.object({});

// Upcoming assignments schema
export const GetUpcomingAssignmentsSchema = v.object({});