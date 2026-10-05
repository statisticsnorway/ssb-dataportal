#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nb } from '../src/libs/language/src/nb.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const skipDirs = new Set([
  'node_modules',
  '.next',
  '.git',
  'coverage',
  'dist',
  'playwright-report',
  'test-results',
  'results',
]);

const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const leafPaths = [];

const collectLeafPaths = (value, currentPath = []) => {
  for (const [key, nestedValue] of Object.entries(value)) {
    const nextPath = [...currentPath, key];

    if (
      nestedValue &&
      typeof nestedValue === 'object' &&
      !Array.isArray(nestedValue) &&
      !(nestedValue instanceof Function)
    ) {
      collectLeafPaths(nestedValue, nextPath);
    } else {
      leafPaths.push(nextPath.join('.'));
    }
  }
};

collectLeafPaths(nb);

const files = [];

const walk = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) {
        walk(entryPath);
      }
      continue;
    }

    if (allowedExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }
};

walk(path.join(repoRoot, 'src'));
walk(path.join(repoRoot, 'e2e'));

const usedPaths = new Set();

const markPath = (translationPath) => {
  if (translationPath) {
    usedPaths.add(translationPath);
  }
};

for (const filePath of files) {
  if (filePath.endsWith(path.normalize('/src/libs/language/src/nb.ts'))) {
    continue;
  }

  const source = fs.readFileSync(filePath, 'utf8');

  for (const match of source.matchAll(/\blocalization((?:\.[A-Za-z_$][\w$]*)+)/g)) {
    markPath(match[1].slice(1));
  }

  const aliases = new Map();

  for (const match of source.matchAll(
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*localization((?:\.[A-Za-z_$][\w$]*)+)\s*;/g,
  )) {
    const alias = match[1];
    const basePath = match[2].slice(1);

    aliases.set(alias, basePath);
    markPath(basePath);
  }

  for (const match of source.matchAll(
    /\b(?:const|let|var)\s*\{([\s\S]*?)\}\s*=\s*localization((?:\.[A-Za-z_$][\w$]*)*)\s*;/g,
  )) {
    const destructuringBody = match[1];
    const basePath = match[2] ? match[2].slice(1) : '';
    const entries = destructuringBody
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    for (const entry of entries) {
      const plainPropertyMatch = entry.match(/^([A-Za-z_$][\w$]*)$/);

      if (plainPropertyMatch) {
        const propertyName = plainPropertyMatch[1];
        const fullPath = basePath ? `${basePath}.${propertyName}` : propertyName;

        markPath(fullPath);
        aliases.set(propertyName, fullPath);
        continue;
      }

      const renamedPropertyMatch = entry.match(/^([A-Za-z_$][\w$]*)\s*:\s*([A-Za-z_$][\w$]*)$/);

      if (renamedPropertyMatch) {
        const propertyName = renamedPropertyMatch[1];
        const aliasName = renamedPropertyMatch[2];
        const fullPath = basePath ? `${basePath}.${propertyName}` : propertyName;

        markPath(fullPath);
        aliases.set(aliasName, fullPath);
      }
    }
  }

  for (const [alias, basePath] of aliases.entries()) {
    const aliasPattern = new RegExp(`\\b${alias}((?:\\.[A-Za-z_$][\\w$]*)+)`, 'g');

    for (const match of source.matchAll(aliasPattern)) {
      markPath(`${basePath}${match[1]}`);
    }
  }
}

const isLeafUsed = (leafPath) => {
  for (const usedPath of usedPaths) {
    if (usedPath === leafPath) {
      return true;
    }

    if (leafPath.startsWith(`${usedPath}.`)) {
      return true;
    }

    if (usedPath.startsWith(`${leafPath}.`)) {
      return true;
    }
  }

  return false;
};

const unusedLeafPaths = leafPaths.filter((leafPath) => !isLeafUsed(leafPath)).sort((a, b) => a.localeCompare(b));

const summary = {
  leafTotal: leafPaths.length,
  unusedCount: unusedLeafPaths.length,
  unusedLeaf: unusedLeafPaths,
};

console.log(JSON.stringify(summary, null, 2));
