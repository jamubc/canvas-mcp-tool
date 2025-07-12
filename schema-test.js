#!/usr/bin/env node

/**
 * Test script to validate Valibot schema to JSON Schema conversion
 * Helps identify any schemas that fail to convert properly
 */

import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

// Import all schemas from the project
import {
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
} from './src/tools/index.js';

const schemas = [
  { name: 'ListCoursesSchema', schema: ListCoursesSchema },
  { name: 'GetCourseSchema', schema: GetCourseSchema },
  { name: 'GetSyllabusSchema', schema: GetSyllabusSchema },
  { name: 'ListAssignmentsSchema', schema: ListAssignmentsSchema },
  { name: 'GetAssignmentSchema', schema: GetAssignmentSchema },
  { name: 'GetSubmissionsSchema', schema: GetSubmissionsSchema },
  { name: 'GetSubmissionSchema', schema: GetSubmissionSchema },
  { name: 'ListFilesSchema', schema: ListFilesSchema },
  { name: 'GetFileSchema', schema: GetFileSchema },
  { name: 'GetDashboardCardsSchema', schema: GetDashboardCardsSchema },
  { name: 'GetDashboardSchema', schema: GetDashboardSchema },
  { name: 'ListFoldersSchema', schema: ListFoldersSchema },
  { name: 'ListCalendarEventsSchema', schema: ListCalendarEventsSchema },
  { name: 'GetUserProfileSchema', schema: GetUserProfileSchema },
  { name: 'GetCourseGradesSchema', schema: GetCourseGradesSchema },
  { name: 'GetUserGradesSchema', schema: GetUserGradesSchema },
  { name: 'ListStudentCoursesSchema', schema: ListStudentCoursesSchema },
  { name: 'ListConversationsSchema', schema: ListConversationsSchema },
  { name: 'GetConversationSchema', schema: GetConversationSchema },
  { name: 'CreateConversationSchema', schema: CreateConversationSchema },
  { name: 'ListNotificationsSchema', schema: ListNotificationsSchema },
  { name: 'ListPagesSchema', schema: ListPagesSchema },
  { name: 'GetPageSchema', schema: GetPageSchema },
  { name: 'ListModulesSchema', schema: ListModulesSchema },
  { name: 'GetModuleSchema', schema: GetModuleSchema },
  { name: 'GetModuleItemSchema', schema: GetModuleItemSchema },
  { name: 'ListDiscussionTopicsSchema', schema: ListDiscussionTopicsSchema },
  { name: 'GetDiscussionTopicSchema', schema: GetDiscussionTopicSchema },
  { name: 'ListAnnouncementsSchema', schema: ListAnnouncementsSchema },
  { name: 'ListQuizzesSchema', schema: ListQuizzesSchema },
  { name: 'GetQuizSchema', schema: GetQuizSchema },
  { name: 'ListRubricsSchema', schema: ListRubricsSchema },
  { name: 'GetRubricSchema', schema: GetRubricSchema },
  { name: 'ListTokenScopesSchema', schema: ListTokenScopesSchema },
  { name: 'GetUpcomingAssignmentsSchema', schema: GetUpcomingAssignmentsSchema }
];

console.log('Testing schema conversions...\n');

let totalSchemas = 0;
let successfulConversions = 0;
let failedConversions = 0;

for (const { name, schema } of schemas) {
  totalSchemas++;
  try {
    const jsonSchema = toJsonSchema(schema);
    console.log(`✅ ${name}: Successfully converted`);
    console.log(`   Properties: ${JSON.stringify(Object.keys(jsonSchema.properties || {}))}`);
    successfulConversions++;
  } catch (error) {
    console.log(`❌ ${name}: FAILED - ${error.message}`);
    console.log(`   Schema type: ${schema.type || 'unknown'}`);
    failedConversions++;
  }
}

console.log(`\nSummary:`);
console.log(`Total schemas: ${totalSchemas}`);
console.log(`Successful conversions: ${successfulConversions}`);
console.log(`Failed conversions: ${failedConversions}`);

if (failedConversions > 0) {
  console.log('\n⚠️  Some schemas failed to convert - this could cause silent tool registration failures!');
  process.exit(1);
} else {
  console.log('\n✅ All schemas converted successfully!');
}