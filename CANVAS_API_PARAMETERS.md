# Canvas API Parameters Reference

This document provides a comprehensive reference for all Canvas API tool parameters based on the current implementation and example client.

## Core Parameter Types

### Common Required Parameters
- `course_id`: Integer (min: 1) - The ID of the course
- `assignment_id`: Integer (min: 1) - The ID of the assignment  
- `user_id`: Integer (min: 1) OR 'self' - The ID of the user or 'self' for current user
- `module_id`: Integer (min: 1) - The ID of the module
- `item_id`: Integer (min: 1) - The ID of the module item
- `file_id`: Integer (min: 1) - The ID of the file
- `folder_id`: Integer (min: 1) - The ID of the folder
- `conversation_id`: Integer (min: 1) - The ID of the conversation
- `topic_id`: Integer (min: 1) - The ID of the discussion topic
- `quiz_id`: Integer (min: 1) - The ID of the quiz
- `rubric_id`: Integer (min: 1) - The ID of the rubric
- `account_id`: Integer (min: 1) - The ID of the account

## Tool Parameters by Category

### Course Management
```typescript
// listCourses
{
  enrollment_type?: 'teacher' | 'student' | 'ta' | 'observer' | 'designer',
  enrollment_state?: 'active' | 'invited' | 'completed',
  include?: ['syllabus_body', 'term', 'course_progress', 'total_students', 'teachers'][]
}

// getCourse
{
  course_id: number,
  include?: ['syllabus_body', 'term', 'course_progress', 'total_students', 'teachers'][]
}

// getSyllabus
{
  course_id: number
}
```

### Assignments & Submissions
```typescript
// listAssignments
{
  course_id: number,
  include?: ['submission', 'assignment_visibility', 'all_dates', 'overrides', 'observed_users'][],
  search_term?: string,
  bucket?: 'past' | 'overdue' | 'undated' | 'ungraded' | 'unsubmitted' | 'upcoming' | 'future',
  order_by?: 'position' | 'name' | 'due_at'
}

// getAssignment
{
  course_id: number,
  assignment_id: number,
  include?: ['submission', 'assignment_visibility', 'overrides', 'observed_users'][]
}

// getSubmissions
{
  course_id: number,
  assignment_id: number
}

// getSubmission
{
  course_id: number,
  assignment_id: number,
  user_id: number | 'self'
}
```

### Files & Folders
```typescript
// listFiles
{
  course_id: number,
  folder_id?: number
}

// getFile
{
  file_id: number
}

// listFolders
{
  course_id: number
}
```

### Dashboard & Calendar
```typescript
// getDashboardCards
{} // No parameters

// getDashboard
{} // No parameters

// listCalendarEvents
{
  type?: 'event' | 'assignment',
  start_date?: string, // ISO date format
  end_date?: string,   // ISO date format
  context_codes?: string[]
}

// getUpcomingAssignments
{} // No parameters
```

### User Profile & Grades
```typescript
// getUserProfile
{
  user_id?: number | 'self'
}

// getCourseGrades
{
  course_id: number
}

// getUserGrades
{} // No parameters

// listStudentCourses
{} // No parameters
```

### Communication
```typescript
// listConversations
{
  scope?: 'unread' | 'starred' | 'archived',
  filter?: string[]
}

// getConversation
{
  conversation_id: number
}

// createConversation
{
  recipients: string[],
  subject: string,
  body: string,
  group_conversation?: boolean,
  attachment_ids?: number[]
}

// listNotifications
{
  include?: ['unread_count'][]
}
```

### Content & Pages
```typescript
// listPages
{
  course_id: number
}

// getPage
{
  course_id: number,
  page_url: string
}

// listModules
{
  course_id: number,
  include?: ['items', 'content_details'][]
}

// getModule
{
  course_id: number,
  module_id: number,
  include?: ['items', 'content_details'][]
}

// getModuleItem
{
  course_id: number,
  module_id: number,
  item_id: number
}

// listDiscussionTopics
{
  course_id: number
}

// getDiscussionTopic
{
  course_id: number,
  topic_id: number
}

// listAnnouncements
{
  course_id: number
}
```

### Assessment (Quizzes & Rubrics)
```typescript
// listQuizzes
{
  course_id: number
}

// getQuiz
{
  course_id: number,
  quiz_id: number
}

// listRubrics
{
  course_id: number
}

// getRubric
{
  course_id: number,
  rubric_id: number
}
```

### Account Management
```typescript
// getAccount
{
  account_id: number
}

// listAccountCourses
{
  account_id: number
}

// getAccountReports
{
  account_id: number
}

// getAccountReport
{
  account_id: number,
  report_type: string,
  report_id: number
}
```

### API Scopes
```typescript
// listTokenScopes
{} // No parameters
```

## Parameter Validation Rules

1. **Required vs Optional**: Parameters without `?` are required
2. **Integer Validation**: All ID parameters must be positive integers (min: 1)
3. **String Arrays**: Include parameters accept arrays of specific string values
4. **Date Formats**: Date parameters should use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
5. **User ID Special Case**: `user_id` accepts either a positive integer or the string 'self'

## Common Parameter Patterns

### Include Arrays
Many endpoints support `include` parameters to fetch additional related data:
- **Courses**: `['syllabus_body', 'term', 'course_progress', 'total_students', 'teachers']`
- **Assignments**: `['submission', 'assignment_visibility', 'all_dates', 'overrides', 'observed_users']`
- **Modules**: `['items', 'content_details']`

### Filtering Options
- **Assignment Buckets**: Filter assignments by status (`past`, `overdue`, `upcoming`, etc.)
- **Enrollment Types**: Filter by user role (`teacher`, `student`, `ta`, etc.)
- **Conversation Scopes**: Filter conversations by read status (`unread`, `starred`, `archived`)

### Pagination
Most list endpoints support automatic pagination handling in the client, so no manual pagination parameters are needed.

## Usage Examples

### Getting Course Information
```javascript
// First get available courses
const courses = await listCourses();

// Then get detailed info for a specific course
const courseDetails = await getCourse({ course_id: courses[0].id });
```

### Working with Assignments
```javascript
// List assignments for a course
const assignments = await listAssignments({ course_id: 123 });

// Get specific assignment with submission data
const assignment = await getAssignment({ 
  course_id: 123, 
  assignment_id: 456,
  include: ['submission'] 
});
```

### Module Navigation
```javascript
// List all modules in a course
const modules = await listModules({ course_id: 123 });

// Get specific module with items
const moduleDetails = await getModule({ 
  course_id: 123, 
  module_id: 789,
  include: ['items'] 
});

// Get specific module item
const item = await getModuleItem({ 
  course_id: 123, 
  module_id: 789, 
  item_id: 101 
});
```