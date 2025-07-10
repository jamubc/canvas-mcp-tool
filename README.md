# Canvas MCP Tool

A tool created for students.

## Available Tools

- `list_assignments` - List assignments for a course
- `get_assignment` - Get assignment details
- `list_courses` - List your enrolled courses
- `get_course` - Get details about a specific course
- `get_profile` - Get your user profile
- `list_users` - List users in a course
- `get_dashboard_cards` - Get your dashboard cards
- `list_calendar_events` - List calendar events
- `get_file_metadata` - Get information about a Canvas file
- `get_file_content` - Extract text content from Canvas files (PDF, DOCX, TXT) - *Coming soon*

## Getting a Canvas API Token
1. Log into your Canvas account
2. Go to Account → Settings
3. Scroll to "Approved Integrations"
4. Click "+ New Access Token"
5. Enter a purpose and click "Generate Token"
6. Copy the token immediately (you won't see it again)

## Usage with Claude Desktop or MCP Clients

Add to your configuration:

```json
{
  "mcpServers": {
    "canvas": {
      "command": "node",
      "args": ["/path/to/canvas-mcp-tool/dist/index.js"],
      "env": {
        "CANVAS_API_URL": "https://your-school.instructure.com",
        "CANVAS_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Local Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Canvas credentials:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Canvas API token:
   ```
   CANVAS_API_URL=https://canvas.instructure.com
   CANVAS_API_TOKEN=your_canvas_api_token_here
   ```

## Build

```bash
npm run build
```

## License

Apache-2.0 WITH Commons-Clause