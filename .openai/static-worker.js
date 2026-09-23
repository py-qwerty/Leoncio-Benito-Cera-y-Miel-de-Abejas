export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const staticRoutes = {
      "/": "/index.html",
      "/historial": "/historial/index.html",
      "/historial/": "/historial/index.html",
      "/historial/expo-1958": "/historial/expo-1958/index.html",
      "/historial/expo-1958/": "/historial/expo-1958/index.html",
    };

    if (staticRoutes[url.pathname]) {
      url.pathname = staticRoutes[url.pathname];
    }

    if (url.pathname.endsWith("/")) {
      url.pathname += "index.html";
    }

    return env.ASSETS.fetch(new Request(url, request));
  },
};
