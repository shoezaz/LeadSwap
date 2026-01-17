import Exa from "exa-js";
import type { Lead, SearchOptions, SimilarityOptions } from "../types";

let exaClient: Exa | null = null;

function getExaClient(): Exa {
  if (!process.env.EXA_API_KEY) {
    throw new Error("EXA_API_KEY is missing. Set it in your .env file.");
  }
  if (!exaClient) {
    exaClient = new Exa(process.env.EXA_API_KEY);
  }
  return exaClient;
}

export async function searchLeads(options: SearchOptions): Promise<Lead[]> {
  const { query, numResults = 5, type = "neural", useAutoprompt = true } = options;
  const exa = getExaClient();

  console.log(`[Exa] Searching for: "${query}"...`);

  const result = await exa.searchAndContents(query, {
    type,
    useAutoprompt,
    numResults,
    text: true,
  });

  return result.results.map((r, index) => ({
    id: r.id || `lead-${index}`,
    title: r.title || "Untitled",
    url: r.url,
    text: r.text,
    publishedDate: r.publishedDate,
    author: r.author,
    score: r.score,
  }));
}

export async function findSimilarCompanies(options: SimilarityOptions): Promise<Lead[]> {
  const { url, numResults = 5, excludeDomains = [] } = options;
  const exa = getExaClient();

  console.log(`[Exa] Finding companies similar to: ${url}...`);

  const result = await exa.findSimilarAndContents(url, {
    numResults,
    excludeSourceDomain: true,
    text: true,
  });

  return result.results.map((r, index) => ({
    id: r.id || `similar-${index}`,
    title: r.title || "Untitled",
    url: r.url,
    text: r.text,
    score: r.score,
  }));
}
