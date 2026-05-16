# Aplicador de Moldura

Aplicação web para upload de foto, seleção de moldura e visualização da prévia.

## Stack

- Node.js
- Express
- HTML
- CSS
- JavaScript

## Instalação

```bash
npm install
```

Configure a porta no arquivo `.env`:

```env
PORT=3000
```

## Uso

Produção:

```bash
npm start
```

Desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Scripts

- `npm start`: executa `node server.js`.
- `npm run dev`: executa `node --watch server.js`.
- `npm run lint`: executa `eslint .`.
- `npm run lint:fix`: executa `eslint . --fix`.
- `npm run format`: executa `prettier . --write`.

## Estrutura do projeto

```text
.
|-- server.js
|-- package.json
|-- src
|   `-- routes
|       |-- frame.js
|       |-- page.js
|       `-- photo.js
`-- public
    |-- css
    |-- font
    |-- frames
    |-- img
    |-- js
    `-- pages
```

## Principais módulos

- `server.js`: configura Express, middlewares, arquivos estáticos e rotas.
- `src/routes/page.js`: serve as páginas `/`, `/moldura` e `/preview`.
- `src/routes/photo.js`: recebe e retorna a foto em memória.
- `src/routes/frame.js`: recebe e retorna a moldura em memória.
- `public/pages`: páginas HTML.
- `public/js`: controladores do frontend.
- `public/css`: estilos.
- `public/frames`: imagens de moldura.

## Rotas

- `GET /`
- `GET /moldura`
- `GET /preview`
- `GET /api/photo`
- `POST /api/photo`
- `GET /api/frame`
- `POST /api/frame`
