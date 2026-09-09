# Radar de Obras

Web application for exploring public infrastructure records from Obrasgov on a map, in a searchable list, and in project detail views.

The application presents a curated, generated snapshot of source records. It does not claim that the snapshot is a complete inventory of Brazilian works, that a registered location is the exact construction site, or that a forecast date proves delay. Source data, map tiles, geocoding services, and their terms remain separate from this repository's code license.

## Run locally

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Other available checks and build commands are listed in `package.json`:

```bash
npm run lint
npm run build
```

The production-oriented start command expects a built Cloudflare/Wrangler output. Deployment metadata in `.openai/hosting.json` is environment-specific and does not provide a public GitHub location.

## Data and services

- Works and project details: [Obrasgov public API](https://api-publica.obrasgov.gestao.gov.br/obras/openapi.json).
- Map rendering: [MapLibre GL JS](https://github.com/maplibre/maplibre-gl-js), with public OpenFreeMap/OpenStreetMap-based tiles.
- Address search: [Nominatim](https://nominatim.org/) and [BrasilAPI](https://github.com/BrasilAPI/BrasilAPI).

The checked-in files under `public/data/` are generated source snapshots for the current build. Verify the upstream terms, attribution requirements, rate limits, and freshness before redistributing or refreshing them.

## License

The repository code is released under the [MIT License](./LICENSE). Third-party data, map tiles, fonts, dependencies, and service APIs are governed by their own licenses and terms.
