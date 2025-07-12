<div style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1em 0;">
<div style="display:flex; justify-content:space-between; align-items:center;">
<h1>canvas-mcp-tool</h1>
<img src="https://img.shields.io/badge/Study%20more%2C%20Work%20less-blue?style=for-the-badge&logo=canvas" alt="Study more, work less badge"/>
</div>
<p>
<a href="https://www.npmjs.com/package/canvas-mcp-tool"><img src="https://img.shields.io/npm/v/canvas-mcp-tool" alt="npm version"/></a>
<a href="https://www.npmjs.com/package/canvas-mcp-tool"><img src="https://img.shields.io/npm/dm/canvas-mcp-tool" alt="npm downloads"/></a>
<a href="https://github.com/jamubc/canvas-mcp-tool"><img src="https://img.shields.io/github/last-commit/jamubc/canvas-mcp-tool" alt="GitHub last commit"/></a>
<a href="https://github.com/jamubc/canvas-mcp-tool/issues"><img src="https://img.shields.io/github/issues/jamubc/canvas-mcp-tool" alt="GitHub issues"/></a>
</p>
<hr style="border:none; border-top:1px solid #ccc; margin:1rem 0;" />
<p>Leverage <img src="https://img.shields.io/badge/natural%20language-commands-blue?style=flat-square&logo=canvas&logoColor=white" alt="natural language badge" style="vertical-align:middle; margin:0 4px;"/> on <img src="https://img.shields.io/badge/Canvas-LMS-005A9C?style=flat-square&logo=canvas&logoColor=white" alt="Canvas badge" style="vertical-align:middle; margin:0 4px;"/> to quickly scan through your courses, find assignments, access content, and stay on top of your academic life. This tool has been refactored for simplicity, maintainability, and performance.</p>
</div>

### ✨ Core Principles

This project was refactored with three key principles in mind, resulting in a cleaner, more efficient, and easier-to-maintain codebase:

  * **DRY (Don't Repeat Yourself)**: Centralized shared logic like caching, API calls, and error handling into a `BaseTool` class to eliminate redundant code.
  * **KISS (Keep It Simple, Stupid)**: Favored simple, function-based tools and utility functions over complex class hierarchies wherever possible.
  * **YAGNI (You Ain't Gonna Need It)**: Implemented only the features that are immediately necessary, avoiding speculative abstractions.

### 🏗️ Architecture

The new architecture is streamlined for clarity and separation of concerns:

```
index.ts (FastMCP Server)
      ↓
Tool Modules (e.g., courses.ts, assignments.ts)
      ↓
BaseTool (Handles Caching, API Logic)
      ↓
Canvas API Client (Axios Wrapper)
      ↓
Canvas Formatter (Handles Output)
```

<hr/>

### 🛠️ Available Tools

The toolset is now more granular and logically organized, giving the AI greater flexibility to retrieve precisely the information you need.

#### **Courses & Enrollments**

  * `listCourses`: Lists all of the user's courses.
  * `getCourse`: Retrieves details for a single course.
  * `listStudentCourses`: A convenience method to list all of the current user's active courses.

#### **Assignments & Submissions**

  * `listAssignments`: Lists assignments for a course.
  * `getAssignment`: Retrieves a specific assignment.
  * `getSubmission`: Retrieves a specific student's submission for an assignment.

#### **Content & Modules**

  * `listPages`: Retrieves the list of content pages in a course.
  * `getPage`: Fetches a single content page by its URL.
  * `listModules`: Lists the modules in a course.
  * `getModule`: Retrieves a single module and its items.
  * `getModuleItem`: Fetches a single module item (e.g., text, file, external link).
  * `getSyllabus`: Fetches the syllabus for a course.

#### **Files & Folders**

  * `listFiles`: Lists files within a course or a specific folder.
  * `listFolders`: Lists all folders in a course.
  * `getFile`: Retrieves details about a single file.

#### **Assessments**

  * `listQuizzes`: Lists all quizzes in a course.
  * `getQuiz`: Retrieves a single quiz.
  * `listRubrics`: Lists all rubrics in a course.
  * `getRubric`: Retrieves a specific rubric.

#### **Communication & Engagement**

  * `listDiscussionTopics`: Lists all discussion topics in a course.
  * `getDiscussionTopic`: Retrieves a single discussion topic.
  * `listAnnouncements`: Fetches all announcements for a course.
  * `listConversations`: Lists the current user's conversations.
  * `getConversation`: Retrieves a single conversation.
  * `createConversation`: Sends a new message.

#### **User & Grades**

  * `getUserProfile`: Gets the profile of the current user.
  * `getCourseGrades`: Retrieves the grades for all enrollments in a course.
  * `getUserGrades`: Fetches the current user's grades across all courses.

#### **Dashboard & Calendar**

  * `getDashboardCards`: Gets the course cards from the user's dashboard.
  * `listCalendarEvents`: Lists calendar events.
  * `getUpcomingAssignments`: Fetches upcoming assignments and events for the current user.

<hr/>

### 🚀 Setup Instructions

Connect the `canvas-mcp-tool` to your favorite AI assistant.

<div style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1em 0;">
<div style="text-align:center; margin-bottom:1rem;">
<img src="https://img.shields.io/badge/Claude_Code-555?logo=claude" alt="Claude Code" style="width:150px; height:auto;" />
</div>

<h4>Claude Desktop</h4>
<p>Add the following to your MCP server configuration:</p>
<pre><code class="language-json">
{
  "mcpServers": {
    "canvas": {
      "command": "npx",
      "args": ["-y", "canvas-mcp-tool"],
      "env": {
        "CANVAS_DOMAIN": "https://your-schools-canvas-url.com",
        "CANVAS_API_TOKEN": "your_canvas_api_token_here"
      }
    }
  }
}
</code></pre>

<h4>Claude Code (Recommended)</h4>
<pre><code class="language-bash"># Add with the required environment variables:
claude mcp add canvas   
--env CANVAS\_API\_URL="[https://your-schools-canvas-url.com](https://your-schools-canvas-url.com)"   
--env CANVAS\_API\_TOKEN="your\_canvas\_api\_token\_here"   
-- npx -y canvas-mcp-tool
</code></pre>
</div>

<div style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1em 0;">
<h3 style="text-align:center;">Gemini CLI</h3>
<p>Add to your <code>~/.gemini/settings.json</code>:</p>
<pre><code class="language-json">
{
  "mcpServers": {
    "canvas": {
      "command": "npx",
      "args": ["-y", "canvas-mcp-tool"],
      "env": {
        "CANVAS_DOMAIN": "https://your-schools-canvas-url.com",
        "CANVAS_API_TOKEN": "your_canvas_api_token_here"
      }
    }
  }
}
</code></pre>
</div>

### ⚙️ Configuration

#### **Getting a Canvas API Token**

> **Warning:** Your Canvas API token is sensitive. Treat it like a password and never share it or commit it to source control.

1.  Log into your Canvas account.
2.  Go to **Account** → **Settings**.
3.  Scroll to "**Approved Integrations**".
4.  Click "**+ New Access Token**".
5.  Give it a purpose (e.g., "MCP Tool") and click "**Generate Token**".
6.  Copy the token to use in your setup.

#### **Environment Variables**

The tool is configured via environment variables.

**Required:**

  * `CANVAS_DOMAIN`: The base URL for your institution's Canvas instance (e.g., `https://canvas.instructure.com`).
  * `CANVAS_API_TOKEN`: Your generated API access token.

**Optional:**

  * `CACHE_TTL`: Cache time-to-live in seconds (default: `300`).
  * `LOG_LEVEL`: Logging level: `debug`, `info`, `warn`, or `error` (default: `info`).
  * `CONCISE_MODE`: Set to `true` for simplified, human-readable responses instead of raw JSON. Great for clients that struggle with large JSON.

### 💡 Features & Best Practices

  * **Smart Filtering**: Tools support parameters for targeted results. The AI will intelligently use them based on your prompts.
      * `listAssignments({ bucket: "upcoming" })`
      * `listCourses({ enrollment_state: "active" })`
  * **Automatic Response Handling**: The tool automatically handles large datasets by showing the most relevant items and providing suggestions for how to narrow your search, eliminating the need for manual pagination.
  * **Optimal Workflow for Finding Exams**: For best results, guide the AI with a clear workflow:
    1.  **Identify Courses**: Start with `getDashboardCards()` or `listStudentCourses()`.
    2.  **Check Multiple Sources**: Use `getSyllabus()`, `listAssignments({ search_term: "exam" })`, and `listCalendarEvents()` for the relevant course. Remember that exams might be called "Quiz", "Test", or "Assessment".
    3.  **Check Syllabus Content**: If no specific assignment is found, the information is likely in the syllabus content itself.

### 💻 Local Development

1.  Clone this repository: `git clone https://github.com/jamubc/canvas-mcp-tool.git`
2.  Install dependencies: `npm install`
3.  Create a `.env` file from the example: `cp .env.example .env`
4.  Edit your new `.env` file and add your Canvas credentials:
    ```bash
    CANVAS_DOMAIN=https://your-schools-canvas-url.com
    CANVAS_API_TOKEN=your_canvas_api_token_here
    ```

#### **Build**

```bash
npm run build
```

<div style="text-align:center; margin:2rem 0;">
<hr style="border:none; height:2px; background:#007bff; margin:0 auto; width:50%;"/>
<a href="LICENSE" style="text-decoration:none;">
<img src="https://img.shields.io/badge/license-Apache%202.0%20%2B%20Commons--Clause-blue" style="vertical-align:middle; margin-right:4px; height:16px;" alt="License"/>
</a>
</div>