import OpenAI from 'openai';

export async function transcribeWithWhisper(audioBlob: Blob, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API Key not configured.');
  }

  try {
    const openai = new OpenAI({ 
      apiKey, 
      dangerouslyAllowBrowser: true 
    });

    // Convert blob to file
    const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      // language: 'pt', // Removed to allow auto-detection
    });

    return transcription.text;
  } catch (error) {
    console.error('Whisper transcription error:', error);
    throw new Error(`Error transcribing with Whisper: ${error instanceof Error ? error.message : String(error)}`);
  }
}
