#!/usr/bin/env node
/**
 * Canvas MCP Tool - FastMCP Implementation
 * Achieves code reduction through BaseTool patterns
 * 
 * Architecture: index.ts → Tool Classes (with BaseTool) → Canvas API → FormatterFacade
 */

import { FastMCP } from 'fastmcp';
import { CanvasClient } from './canvas-client.js';
import * as v from 'valibot';
import {
  AssignmentsTool,
  CoursesTool,
  FilesDashboardTool,
  UserProfileTool,
  CommunicationTool,
  ContentTool,
  AssessmentTool,
  ListCoursesSchema,
  GetCourseSchema,
  GetSyllabusSchema,
  ListAssignmentsSchema,
  GetAssignmentSchema,
  GetSubmissionsSchema,
  GetSubmissionSchema,
  ListFilesSchema,
  GetFileSchema,
  GetDashboardCardsSchema,
  GetDashboardSchema,
  ListFoldersSchema,
  ListCalendarEventsSchema,
  GetUserProfileSchema,
  GetCourseGradesSchema,
  GetUserGradesSchema,
  ListStudentCoursesSchema,
  ListConversationsSchema,
  GetConversationSchema,
  CreateConversationSchema,
  ListNotificationsSchema,
  ListPagesSchema,
  GetPageSchema,
  ListModulesSchema,
  GetModuleSchema,
  GetModuleItemSchema,
  ListDiscussionTopicsSchema,
  GetDiscussionTopicSchema,
  ListAnnouncementsSchema,
  ListQuizzesSchema,
  GetQuizSchema,
  ListRubricsSchema,
  GetRubricSchema,
  ListTokenScopesSchema,
  GetUpcomingAssignmentsSchema
} from './tools/index.js';
import { toJsonSchema } from '@valibot/to-json-schema';

// Load environment variables
const CANVAS_DOMAIN = process.env.CANVAS_DOMAIN;
const CANVAS_API_TOKEN = process.env.CANVAS_API_TOKEN;

if (!CANVAS_DOMAIN || !CANVAS_API_TOKEN) {
  console.error('Error: CANVAS_DOMAIN and CANVAS_API_TOKEN must be set in environment variables');
  process.exit(1);
}

// Initialize Canvas client
const client = new CanvasClient(CANVAS_DOMAIN, CANVAS_API_TOKEN);

// Initialize all tools with the client
const courses = new CoursesTool(client);
const assignments = new AssignmentsTool(client);
const filesDashboard = new FilesDashboardTool(client);
const userProfile = new UserProfileTool(client);
const communication = new CommunicationTool(client);
const content = new ContentTool(client);
const assessment = new AssessmentTool(client);

// Create FastMCP server
const server = new FastMCP({
  name: 'canvas-mcp',
  version: '2.0.0'
});

// Helper function to register tools with minimal boilerplate (KISS principle)
const tool = (name: string, description: string, schema: v.BaseSchema<any, any, any>, execute: Function) => {
  // Convert Valibot schema to JSON Schema
  server.addTool({
    name,
    description,
    parameters: toJsonSchema(schema) as any,
    execute: execute as any
  });
};

// ===== Courses Tools =====
tool('listCourses', 'List all courses the user is enrolled in', ListCoursesSchema, courses.listCourses.bind(courses));
tool('getCourse', 'Get details for a specific course', GetCourseSchema, courses.getCourse.bind(courses));
tool('getSyllabus', 'Get syllabus for a course', GetSyllabusSchema, courses.getSyllabus.bind(courses));

// ===== Assignments & Submissions Tools =====
tool('listAssignments', 'List assignments for a course', ListAssignmentsSchema, assignments.listAssignments.bind(assignments));
tool('getAssignment', 'Get a single assignment', GetAssignmentSchema, assignments.getAssignment.bind(assignments));
tool('getSubmissions', 'Get all submissions for an assignment', GetSubmissionsSchema, assignments.getSubmissions.bind(assignments));
tool('getSubmission', 'Get current user submission for an assignment', GetSubmissionSchema, (params: any) => 
  assignments.getSubmission({ ...params, user_id: 'self' }));

// ===== Files & Folders Tools =====
tool('listFiles', 'List files in a course or folder', ListFilesSchema, filesDashboard.listFiles.bind(filesDashboard));
tool('listFolders', 'List all folders in a course', ListFoldersSchema, filesDashboard.listFolders.bind(filesDashboard));
tool('getFile', 'Get file metadata', GetFileSchema, filesDashboard.getFile.bind(filesDashboard));

// ===== Dashboard Tools =====
tool('getDashboardCards', 'Get course cards from dashboard', GetDashboardCardsSchema, filesDashboard.getDashboardCards.bind(filesDashboard));
tool('getDashboard', 'Get user dashboard info', GetDashboardSchema, filesDashboard.getDashboard.bind(filesDashboard));
tool('listCalendarEvents', 'List calendar events', ListCalendarEventsSchema, filesDashboard.listCalendarEvents.bind(filesDashboard));
tool('getUpcomingAssignments', 'Get upcoming assignments and events', GetUpcomingAssignmentsSchema, filesDashboard.getUpcomingAssignments.bind(filesDashboard));

// ===== User Profile & Grades Tools =====
tool('getUserProfile', 'Get user profile information', GetUserProfileSchema, userProfile.getUserProfile.bind(userProfile));
tool('getCourseGrades', 'Get grades for a course', GetCourseGradesSchema, userProfile.getCourseGrades.bind(userProfile));
tool('getUserGrades', 'Get all user grades', GetUserGradesSchema, userProfile.getUserGrades.bind(userProfile));
tool('listStudentCourses', 'List active student courses', ListStudentCoursesSchema, userProfile.listStudentCourses.bind(userProfile));

// ===== Communication Tools =====
tool('listConversations', 'List user conversations', ListConversationsSchema, communication.listConversations.bind(communication));
tool('getConversation', 'Get a single conversation', GetConversationSchema, communication.getConversation.bind(communication));
tool('createConversation', 'Send a new message', CreateConversationSchema, communication.createConversation.bind(communication));
tool('listNotifications', 'List user notifications', ListNotificationsSchema, communication.listNotifications.bind(communication));

// ===== Content Tools =====
tool('listPages', 'List content pages in a course', ListPagesSchema, content.listPages.bind(content));
tool('getPage', 'Get a single content page', GetPageSchema, content.getPage.bind(content));
tool('listModules', 'List modules in a course', ListModulesSchema, content.listModules.bind(content));
tool('getModule', 'Get a single module', GetModuleSchema, content.getModule.bind(content));
tool('getModuleItem', 'Get a module item', GetModuleItemSchema, content.getModuleItem.bind(content));
tool('listDiscussionTopics', 'List discussion topics', ListDiscussionTopicsSchema, content.listDiscussionTopics.bind(content));
tool('getDiscussionTopic', 'Get a discussion topic', GetDiscussionTopicSchema, content.getDiscussionTopic.bind(content));
tool('listAnnouncements', 'List course announcements', ListAnnouncementsSchema, content.listAnnouncements.bind(content));

// ===== Assessment Tools =====
tool('listQuizzes', 'List quizzes in a course', ListQuizzesSchema, assessment.listQuizzes.bind(assessment));
tool('getQuiz', 'Get a single quiz', GetQuizSchema, assessment.getQuiz.bind(assessment));
tool('listRubrics', 'List rubrics in a course', ListRubricsSchema, assessment.listRubrics.bind(assessment));
tool('getRubric', 'Get a specific rubric', GetRubricSchema, assessment.getRubric.bind(assessment));

// ===== API Scopes Tool =====
tool('listTokenScopes', 'List available API scopes', ListTokenScopesSchema, async () => {
  return client.get('/accounts/self/scopes');
});

// Start the server
server.start({ transportType: 'stdio' });

console.log(`Canvas MCP Tool v2.0.0 started
- Domain: ${CANVAS_DOMAIN}
- --> 31 BaseTool patterns
`);