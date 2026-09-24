self.onmessage = async () => {
  try {
    const manifestResponse = await fetch('/data/projects-manifest.json');
    let body;
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      const chunks = await Promise.all(manifest.files.map(async file => {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`Falha no bloco ${file.url}`);
        return response.json();
      }));
      body = { meta: manifest.meta, projects: chunks.flat() };
    } else {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Falha na leitura dos dados');
      body = await response.json();
    }
    self.postMessage(body);
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
};
