// @flow
import { test, testPromise, should } from "../server/testy.js";
import staticCache from "../server/static_cache.js";
import requestPromise from "../server/request_promise.js";
import fs, { read } from "fs";

test("Cache | Clearing the cache", () /*: void */ => {
  should(staticCache.clearCache()).be.exactly(true);
});

test("Cache | Writing to and reading from /index.html", () /*: any */ => {
  const cachedFilePath /*: string */ = "/";

  const result = staticCache.writeToCache(cachedFilePath, "Testy test");
  should(result).be.exactly(true);
  should(staticCache.readFromCache(cachedFilePath, 0, true)).be.exactly(
    "Testy test",
  );
  fs.unlink("./public" + cachedFilePath + "index.html", (
    e /*: Error | null | typeof undefined */,
  ) /*: void */ => {
    if (e) {
      console.error(e);
    }
  });
  return true;
});

test("Cache | Writing to and reading from the deep cache", () /*: any */ => {
  const cachedFilePath /*: string */ =
    "/this/is/a/test/of/the/cache/script/testytest";

  const result = staticCache.writeToCache(cachedFilePath, "Testy test");
  if (result) {
    should(result).be.exactly(true);
    should(staticCache.readFromCache(cachedFilePath, 0, true)).be.exactly(
      "Testy test",
    );
    // Clean up the file
    // $FlowFixMe
    fs.rmdirSync("./public/this", { recursive: true });
  }
});
