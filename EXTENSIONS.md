# Required Extensions and Tools

## VS Code Extensions (Recommended)

### Essential Extensions
1. **ESLint** - `dbaeumer.vscode-eslint`
   - JavaScript/TypeScript linting
   - Code quality checks

2. **Prettier** - `esbenp.prettier-vscode`
   - Code formatting
   - Consistent style

3. **Python** - `ms-python.python`
   - Python language support
   - Debugging and IntelliSense

4. **Python Debugger** - `ms-python.debugpy`
   - Python debugging capabilities

5. **Redis** - `cweijan.vscode-redis-client`
   - Redis database management
   - View Redis keys and data

6. **Docker** - `ms-azuretools.vscode-docker`
   - Docker container management
   - Redis container support

### Frontend Extensions
7. **Tailwind CSS IntelliSense** - `bradlc.vscode-tailwindcss`
   - Tailwind class autocomplete
   - CSS preview

8. **React/JSX Snippets** - `dsznajder.es7-react-jsx-snippets`
   - React component snippets
   - Faster development

9. **TypeScript Importer** - `pmneo.tsimporter`
   - Auto import TypeScript modules
   - Better import management

### Backend Extensions
10. **Thunder Client** - `rangav.vscode-thunder-client`
    - API testing
    - Test FastAPI endpoints

11. **Jupyter** - `ms-toolsai.jupyter`
    - Python notebook support
    - Model testing

## Optional but Helpful Extensions

### Development Tools
12. **GitLens** - `eamodio.gitlens`
    - Git blame and history
    - Code insights

13. **Live Server** - `ritwickdey.LiveServer`
    - Local development server
    - Auto-reload

14. **Auto Rename Tag** - `formulahendry.auto-rename-tag`
    - Auto rename paired tags
    - HTML/XML editing

### Database Tools
15. **SQLite** - `alexcvzz.vscode-sqlite`
    - SQLite database viewer
    - Query execution

16. **MongoDB for VS Code** - `mongodb.mongodb-vscode`
    - Database management
    - Query builder

## Browser Extensions

### Chrome/Firefox Extensions
1. **React Developer Tools**
   - React component inspection
   - State debugging

2. **Redux DevTools**
   - State management debugging
   - Store inspection

## System Requirements Check

### Verify Installation
```bash
# Node.js
node --version  # Should be 18+
npm --version

# Python
python --version  # Should be 3.9+
pip --version

# Redis
redis-cli ping  # Should return PONG

# FFmpeg
ffmpeg -version
```

### VS Code Setup Commands
```bash
# Install recommended extensions (VS Code)
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-python.python
code --install-extension ms-python.debugpy
code --install-extension cweijan.vscode-redis-client
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-jsx-snippets
code --install-extension rangav.vscode-thunder-client
```

## Development Environment Setup

### 1. VS Code Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./backend/venv/Scripts/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

### 2. VS Code Launch Tasks
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/backend/main.py",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/backend"
    },
    {
      "name": "Python: Celery Worker",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/worker/start_worker.py",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/worker"
    }
  ]
}
```

### 3. VS Code Tasks
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "npm run dev",
      "cwd": "${workspaceFolder}/frontend",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "python main.py",
      "cwd": "${workspaceFolder}/backend",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Start Worker",
      "type": "shell",
      "command": "celery -A video_processor worker --loglevel=info",
      "cwd": "${workspaceFolder}/worker",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

## Minimum Required Extensions

If you want to install just the essentials:

### Must-Have (3 extensions)
1. **Python** (`ms-python.python`)
2. **ESLint** (`dbaeumer.vscode-eslint`) 
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)

### Nice-to-Have (2 extensions)
4. **Prettier** (`esbenp.prettier-vscode`)
5. **Thunder Client** (`rangav.vscode-thunder-client`)

## Alternative Editors

### WebStorm (JetBrains)
- Built-in Python support
- Redis integration
- Docker tools
- No extensions needed

### Vim/Neovim
- `coc-python` for Python
- `coc-tailwindcss` for Tailwind
- `coc-eslint` for linting

## Installation Commands

### Quick Install (PowerShell)
```powershell
# Install essential VS Code extensions
code --install-extension ms-python.python
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension rangav.vscode-thunder-client
```

### Verify Extensions
```bash
# List installed extensions
code --list-extensions
```

---

**Note**: These extensions are not required to run the project, but they significantly improve the development experience with better IntelliSense, debugging, and code quality tools.
