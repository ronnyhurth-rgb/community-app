export async function queryLocalOllama(prompt, model = 'qwen2.5-coder:7b') {
  const response = await fetch('http://127.0.0.1:11434/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

export async function pingOllama() {
  const response = await fetch('http://127.0.0.1:11434/v1/models');
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama ping failed (${response.status}): ${body}`);
  }
  return response.json();
}
