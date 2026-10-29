import { serve } from "bun";

import { getGitBranches, getDiffFilenames } from "@forgel/utils";

import index from "./index.html";

const projectDummy = {
  path: "",
};

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/branches": {
      async GET(req) {
        const branches = getGitBranches(projectDummy.path);
        return Response.json({
          data: branches,
          method: "GET",
        });
      },
    },

    "/api/diffs/:patchid": {
      async GET(req) {
        const diffFiles = getDiffFilenames({
          path: projectDummy.path,
          target: "support_api_key_auth",
          source: "main",
        });
        return Response.json({
          message: diffFiles,
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
