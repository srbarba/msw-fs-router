import { globby } from "globby";
import { relative } from "pathe";
import { joinURL, withBase, withLeadingSlash, withoutTrailingSlash } from "ufo";
import {
  http,
  HttpHandler,
  type DefaultBodyType,
  type HttpResponseResolver,
  type PathParams,
} from "msw";

export function defineMswHandler<
  Params extends PathParams<keyof Params> = PathParams,
  RequestBodyType extends DefaultBodyType = DefaultBodyType,
  ResponseBodyType extends DefaultBodyType = DefaultBodyType,
>(resolver: HttpResponseResolver<Params, RequestBodyType, ResponseBodyType>) {
  return resolver;
}

const defaultGlobPattern = "**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}";
const defaultSuffixRegex = /\.(delete|get|head|options|patch|post|put)?$/;
export const defaults = {
  scanPattern: defaultGlobPattern,
  suffixRegex: defaultSuffixRegex,
};

// prettier-ignore
type MatchedMethodSuffix = "delete" | "get" | "head" | "options" | "patch" | "post" | "put";
type FileInfo = { path: string; fullPath: string };

type Options = {
  baseURL: string;
  scanDirs: string[];
  scanPattern?: string;
  suffixRegex?: RegExp;
  ignore?: string[];
};

export async function getMswHandlers(options: Options) {
  const files = await scanHandlers(options);
  const handlers: HttpHandler[] = await Promise.all(
    files.map(async (f) => {
      const method = f.method ?? "all";
      return http[method](joinURL(options.baseURL, f.route), async (...args) =>
        (await import(f.handler)).default(...args),
      );
    }),
  );
  return handlers;
}

async function scanHandlers(options: Options, prefix = "/") {
  const files = await scanFiles(options);
  return files.map((file) => {
    let route = file.path
      .replace(/\.[A-Za-z]+$/, "")
      .replace(/\(([^(/\\]+)\)[/\\]/g, "")
      .replace(/\[\.{3}]/g, "**")
      .replace(/\[\.{3}(\w+)]/g, "**:$1")
      .replace(/\[(\w+)]/g, ":$1");
    route = withLeadingSlash(withoutTrailingSlash(withBase(route, prefix)));

    const suffixMatch = route.match(options.suffixRegex || defaultSuffixRegex);
    let method: MatchedMethodSuffix | undefined;
    if (suffixMatch?.index) {
      route = route.slice(0, Math.max(0, suffixMatch.index));
      method = suffixMatch[1] as MatchedMethodSuffix;
    }

    route = route.replace(/\/index$/, "") || "/";

    return {
      handler: file.fullPath,
      route,
      method,
    };
  });
}

async function scanFiles(options: Options): Promise<FileInfo[]> {
  const files = await Promise.all(
    options.scanDirs.map((dir) => scanDir(options, dir)),
  ).then((r) => r.flat());
  return files;
}

async function scanDir(options: Options, dir: string): Promise<FileInfo[]> {
  const fileNames = await globby(options.scanPattern || defaultGlobPattern, {
    cwd: dir,
    dot: true,
    ignore: options.ignore,
    absolute: true,
  });
  return fileNames
    .map((fullPath) => {
      return {
        fullPath,
        path: relative(dir, fullPath),
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}
