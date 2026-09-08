export async function GET(request: Request) {
  return Response.redirect(new URL('/data/projects.json', request.url), 307);
}
