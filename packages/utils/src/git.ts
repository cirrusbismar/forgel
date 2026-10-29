import nodePath from "node:path";

import { readBuffer } from "./buffer";

/**
 * List out available local branches from a repository or project
 * @param path Repository or project path
 * @returns list of branches from the project path
 */
export const getGitBranches = (path: string) => {
  const repoPath = nodePath.resolve(path);
  const branches = readBuffer<string[]>("git branch", {
    cwd: repoPath,
    reducer: (buffer) => {
      return buffer.split('\n')
        .map(branch => branch.trim())
        .filter(branch => branch.length > 0)
        .map((branch) => {
        // Remove the active branch marker '*' or '+' if present
        const destructedBranchName = branch.split(" ");
        return destructedBranchName[destructedBranchName.length - 1] ?? "";
      });
    },
  });
  return branches;
};

/**
 * 
 * @param options 
 * @returns 
 */
export const getDiffFilenames = (options: { path: string, source: string, target: string }) => {
  const repoPath = nodePath.resolve(options.path);
  const diffText = readBuffer(`git diff -U1 ${options.source} ${options.target}`, {
    cwd: repoPath,
    reducer: (buffer) => {
      // Splits before "diff --git" without removing it, filtering out any leading empty chunk
      return buffer.split(/(?=diff --git)/).filter(Boolean);
    },
  });
  return diffText;
};
