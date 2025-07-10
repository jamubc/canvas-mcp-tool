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
  <p>Leverage <img src="https://img.shields.io/badge/natural%20language-commands-blue?style=flat-square&logo=canvas&logoColor=white" alt="natural language badge" style="vertical-align:middle; margin:0 4px;"/> on <img src="https://img.shields.io/badge/Canvas-LMS-005A9C?style=flat-square&logo=canvas&logoColor=white" alt="Canvas badge" style="vertical-align:middle; margin:0 4px;"/> to quickly scan through your courses, find assignments and related content & stay up to date with your academics.</p>
</div>

<div style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1em 0;">
  <strong>📋 Available Tools</strong>
  <ul>
    <li><code>list_assignments</code> - List assignments for a course</li>
    <li><code>get_assignment</code> - Get assignment details</li>
    <li><code>list_courses</code> - List your enrolled courses</li>
    <li><code>get_course</code> - Get details about a specific course</li>
    <li><code>get_profile</code> - Get your user profile</li>
    <li><code>list_users</code> - List users in a course</li>
    <li><code>get_dashboard_cards</code> - Get your dashboard cards</li>
    <li><code>list_calendar_events</code> - List calendar events</li>
    <li><code>get_file_metadata</code> - Get information about a Canvas file</li>
    <li><code>get_file_content</code> - Extract text content from Canvas files (DOCX, TXT, and more)</li>
  </ul>
</div>

<div style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin:1em 0;">
  <div style="text-align:center; margin-bottom:1rem;">
    <img src="https://img.shields.io/badge/Claude_Code-555?logo=claude" alt="Claude Code" style="width:150px; height:auto;" />
  </div>

  <h3>Claude Desktop</h3>
  <pre><code class="language-json">{
  "mcpServers": {
    "canvas": {
      "command": "npx",
      "args": ["-y", "canvas-mcp-tool"],
      "env": {
        "CANVAS_API_URL": "https://your-schools-canvas-url.com",
        "CANVAS_API_TOKEN": "your_token_here",
        "CANVAS_API_VERSION": "v1",
        "CANVAS_API_TIMEOUT": "30000",
        "CANVAS_MAX_RETRIES": "3"
      }
    }
  }
}
</code></pre>

  <h3>Claude Code (Recommended)</h3>
  <pre><code class="language-bash"># Simple usage (if env vars are already set in your shell):
claude mcp add canvas -- npx -y canvas-mcp-tool
</code></pre>

  <pre><code class="language-bash"># Or inline specify all required and optional variables:
CANVAS_API_URL="https://your-schools-canvas-url.com" \
CANVAS_API_TOKEN="your_canvas_api_token_here" \
CANVAS_API_VERSION="v1" \
CANVAS_API_TIMEOUT=30000 \
CANVAS_MAX_RETRIES=3 \
claude mcp add canvas -- npx -y canvas-mcp-tool
</code></pre>
</div>

  <h3>Gemini CLI</h3>
  <p>Add to your <code>~/.gemini/settings.json</code>:</p>
  <pre><code class="language-json">{
  "mcpServers": {
    "canvas": {
      "command": "npx",
      "args": ["-y", "canvas-mcp-tool"],
      "env": {
        "CANVAS_API_URL": "https://your-schools-canvas-url.com",
        "CANVAS_API_TOKEN": "your_token_here",
        "CANVAS_API_VERSION": "v1",
        "CANVAS_API_TIMEOUT": "30000",
        "CANVAS_MAX_RETRIES": "3"
      }
    }
  }
}
</code></pre>
  <p>Note: Gemini CLI requires all environment variables to be explicitly defined in the configuration.</p>
</div>

## Configuration
After installation, you'll need to configure your Canvas URL and API token:

## Getting a Canvas API Token
> **Warning:** Your Canvas API token is sensitive - treat it like a password and never share it or commit it to source control.
1. Log into your Canvas account
2. Go to Account → Settings
3. Scroll to "Approved Integrations"
4. Click "+ New Access Token"
5. Enter a purpose and click "Generate Token"
6. Copy the token and use in it your preferred setup.

### For Claude Desktop

You can add these to your shell profile (`~/.zshrc`, `~/.bashrc`, etc.) so they're loaded automatically:

```bash
# ~/.zshrc or ~/.bashrc
export CANVAS_API_URL="https://your-schools-canvas-url.com"
export CANVAS_API_TOKEN="your_canvas_api_token_here"
export CANVAS_API_VERSION="v1"
export CANVAS_API_TIMEOUT=30000
export CANVAS_MAX_RETRIES=3
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
   CANVAS_API_URL=https://your-schools-canvas-url.com
   CANVAS_API_TOKEN=your_canvas_api_token_here
   ```
   Add optional cache and logging settings (defaults shown):
   ```
   CACHE_ENABLED=true          # Enable response caching (set to false to disable)
   CACHE_TTL=300               # Cache time-to-live in seconds
   LOG_LEVEL=info              # Logging level: debug, info, warn, error
   LOGGING_ENABLED=true        # Enable logging (set to false to disable)
   ```

## Build

```bash
npm run build
```


<div style="text-align:center; margin:2rem 0;">
  <hr style="border:none; height:2px; background:#007bff; margin:0 auto; width:50%;"/>
  <a href="LICENSE" style="text-decoration:none;">
    <img src="https://img.shields.io/badge/license-Apache%202.0%20%2B%20Commons--Clause-blue" style="vertical-align:middle; margin-right:4px; height:16px;" alt="License"/>
  </a>
</div>

<div align="center" style="margin-top:1rem;">
  <a href="https://www.anthropic.com/news/model-context-protocol" target="_blank" rel="noopener noreferrer"
     style="font-size:0.75rem; color:#555; background:#f0f0f0; padding:4px 6px; border-radius:4px; text-decoration:none; display:inline-flex; align-items:center;">
    <span style="margin-right:4px; font-size:1rem;">🛈</span> What is an MCP?
  </a>
</div>