export interface IElectronAPI {
  ipcRenderer: {
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
    off: (channel: string, ...args: any[]) => void;
    send: (channel: string, ...args: any[]) => void;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
  };
}

export interface INotionAPI {
  createPage: (params: {
    apiKey: string;
    databaseId: string;
    title: string;
    content: string;
    transcript: string;
    category: string;
    tags: string[];
  }) => Promise<any>;
}

declare global {
  interface Window {
    ipcRenderer: IElectronAPI['ipcRenderer'];
    notionAPI: INotionAPI;
  }
}
