import { pingOllama, queryLocalOllama } from './src/ollamaClient.js';

async function run() {
  try {
    console.log('Checking local Ollama...');
    const models = await pingOllama();
    console.log('Ollama is reachable. Available models:');
    console.log(models);

    const prompt = 'Sag mir kurz, ob diese Installation lokal verbindet: qwen via Ollama.';
    const answer = await queryLocalOllama(prompt);
    console.log('\nOllama response:');
    console.log(answer);
  } catch (error) {
    console.error('Ollama check failed:', error);
    process.exit(1);
  }
}

run();
