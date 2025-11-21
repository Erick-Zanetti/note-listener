interface SaveToNotionParams {
  title: string;
  content: string;
  transcript: string;
  category: string;
  tags: string[];
  apiKey: string;
  databaseId: string;
}

export async function saveToNotion({ title, content, transcript, category, tags, apiKey, databaseId }: SaveToNotionParams): Promise<void> {
  // Use IPC to call Main process (bypasses CORS)
  console.log('🔵 saveToNotion called');
  console.log('Has notionAPI?', !!window.notionAPI);
  
  try {
    if (window.notionAPI) {
      // Running in Electron
      console.log('🔵 Calling notionAPI.createPage...');
      await window.notionAPI.createPage({
        apiKey,
        databaseId,
        title,
        content,
        transcript,
        category,
        tags,
      });
      console.log('✅ Notion page created!');
    } else {
      // Fallback: Running in browser (will fail due to CORS, but try anyway)
      console.error('❌ notionAPI not available');
      throw new Error('Notion API only works in Electron. Run the app with "npm run electron:dev".');
    }
  } catch (error) {
    console.error('❌ Notion Save Error:', error);
    throw error;
  }
}
