```typescript
addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request: Request) {
  return new Response("Hello world", {
    headers: { "Content-Type": "text/html" }
  });
}
```
