# Contributing to canvas-mcp-tool

First off, thank you for taking the time to contribute! Your help improving canvas-mcp-tool is greatly appreciated.

## How to Report Bugs or Suggest Enhancements

1. Check the existing [issues](https://github.com/jamubc/canvas-mcp-tool/issues) to see if your bug or feature request is already reported.
2. If not, open a new issue with a descriptive title and detailed steps to reproduce (for bugs) or use cases (for enhancements).
3. Label your issue appropriately (bug, enhancement, documentation, etc.) if you have permissions.

## How to Submit a Pull Request

1. Fork the repository on GitHub.
2. Clone the main repository locally:
   ```bash
   git clone https://github.com/jamubc/canvas-mcp-tool.git
   cd canvas-mcp-tool
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Make your changes in TypeScript under the `src/` directory.
6. Ensure your code follows the existing style and runs lint/tests:
   ```bash
   npm run lint
   npm test
   ```
7. Build the project to verify there are no compilation errors:
   ```bash
   npm run build
   ```
8. Commit your changes with clear, concise commit messages:
   ```bash
   git add .
   git commit -m "feat: add awesome new feature"
   ```
9. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
10. Open a pull request against the `main` branch of the upstream repository.

## Code Style and Standards

- We use ESLint and TypeScript. Please run `npm run lint` locally before submitting.
- Follow the existing code patterns, including error handling and logger usage.
- Write clear, concise comments and JSDoc annotations for exported functions and classes.
- Update or add unit tests under `src/` and `src/**/*.test.ts` for any new functionality.

## Running Tests

The project uses Jest for testing. To run the full test suite:
```bash
npm test
```

## Development Workflow

- `npm run dev` — runs the server in watch mode (using `tsx`).
- `npm run build` — transpiles TypeScript to `dist/`.
- `npm start` — runs the compiled code from `dist/`.
- `npm run clean` — removes the `dist/` directory.

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you agree to abide by its terms.

## License

All contributions are licensed under the same [Apache 2.0 + Commons-Clause](LICENSE) terms as the project.
