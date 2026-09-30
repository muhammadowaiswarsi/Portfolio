export {
  DEFAULT_LEXICAL_LIMIT,
  getLexicalRetrievalConfig,
  type LexicalRetrievalConfig,
} from "@/lib/rag/lexical/config";
export { Bm25Index, type Bm25Document, type Bm25Hit } from "@/lib/rag/lexical/bm25";
export {
  LEXICAL_CORPUS_RELATIVE_PATH,
  buildCorpusFile,
  chunksToCorpusEntries,
  entrySearchText,
  getLexicalCorpusAbsolutePath,
  readLexicalCorpus,
  writeLexicalCorpus,
  type LexicalCorpusEntry,
  type LexicalCorpusFile,
} from "@/lib/rag/lexical/corpus";
export {
  LexicalSearchError,
  lexicalSearch,
  resetLexicalIndexCache,
  type LexicalSearchOptions,
} from "@/lib/rag/lexical/search";
export { preprocessQuery, tokenize } from "@/lib/rag/lexical/tokenize";
