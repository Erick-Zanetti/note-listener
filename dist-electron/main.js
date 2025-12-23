import { app, BrowserWindow, shell, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');
let win;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 700,
        resizable: false, // Fixed size as requested
        icon: path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true, // Minimalist
        frame: true, // Keep frame for standard window controls, or false for custom
        backgroundColor: '#1e1e1e', // Dark mode bg
    });
    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString());
    });
    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
        // Open DevTools in development
        // win.webContents.openDevTools()
    }
    else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(process.env.DIST || '', 'index.html'));
    }
    // Open external links in browser
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:'))
            shell.openExternal(url);
        return { action: 'deny' };
    });
}
// IPC Handlers for Notion API (to bypass CORS)
ipcMain.handle('notion:createPage', async (_event, { apiKey, databaseId, title, content, transcript, category, tags }) => {
    console.log('📝 Notion IPC Handler called');
    console.log('Database ID:', databaseId);
    console.log('Title:', title);
    console.log('Category:', category);
    console.log('Tags:', tags);
    try {
        const properties = {
            Name: {
                title: [
                    {
                        text: {
                            content: title,
                        },
                    },
                ],
            },
        };
        // Add Category if provided
        if (category) {
            // Capitalize properly: first letter uppercase, rest lowercase
            const formattedCategory = category.trim().charAt(0).toUpperCase() + category.trim().slice(1).toLowerCase();
            properties.Category = {
                select: {
                    name: formattedCategory,
                },
            };
        }
        // Add Tags if provided
        if (tags && tags.length > 0) {
            properties.Tags = {
                multi_select: tags.map((tag) => {
                    const trimmed = tag.trim();
                    return {
                        name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
                    };
                }),
            };
        }
        // Build children blocks (content + transcript section)
        const children = [];
        // Add main content
        if (content) {
            children.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: content.substring(0, 2000),
                            },
                        },
                    ],
                },
            });
        }
        // Add divider
        children.push({
            object: 'block',
            type: 'divider',
            divider: {},
        });
        // Add transcript heading
        children.push({
            object: 'block',
            type: 'heading_2',
            heading_2: {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: '📝 Original Transcript',
                        },
                    },
                ],
            },
        });
        // Add transcript content
        if (transcript) {
            children.push({
                object: 'block',
                type: 'paragraph',
                paragraph: {
                    rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: transcript.substring(0, 2000),
                            },
                        },
                    ],
                },
            });
        }
        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
                parent: { database_id: databaseId },
                properties,
                children,
            }),
        });
        console.log('✅ Notion API Response Status:', response.status);
        if (!response.ok) {
            const error = await response.text();
            console.error('❌ Notion API Error:', error);
            throw new Error(`Notion API error: ${response.status} - ${error}`);
        }
        const result = await response.json();
        console.log('✅ Notion page created successfully!');
        return result;
    }
    catch (error) {
        console.error('❌ Notion API error:', error);
        throw error;
    }
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
app.whenReady().then(createWindow);
