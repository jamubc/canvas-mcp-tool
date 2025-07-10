# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/) and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Enhanced support for a wide range of file formats (DOCX, TXT, PDF, etc.) via `get_file_content`
- Optimized caching mechanism for faster response times and improved data and tool calls
- Google Gemini CLI compatibility with setup instructions
- Fixed JSON schema compatibility issue for multi-type parameters

## [1.0.0] - 2025-07-09
### Added
- Initial release of `canvas-mcp-tool`
- Support for querying Canvas LMS via MCP protocol
- Implemented tools:
  - `list_assignments`
  - `get_assignment`
  - `list_courses`
  - `get_course`
  - `get_profile`
  - `list_users`
  - `get_dashboard_cards`
  - simple `list_calendar_events`
  - simple `get_file_metadata`
  - simple`get_file_content`
- Configuration via `.env` or `claude_desktop_config.json`
- Configurable settings for caching and logging
- Security policy and contribution guidelines added
