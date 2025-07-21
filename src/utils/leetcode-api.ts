import type { GraphQLResponse, Problem } from '../types/leetcode.js';

const GRAPHQL_URL = 'https://leetcode.com/graphql';

const QUESTION_QUERY = `
query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        content
        difficulty
        codeSnippets {
            lang
            langSlug
            code
        }
        exampleTestcases
        sampleTestCase
        metaData
    }
}`;

export async function fetchProblem(titleSlug: string): Promise<Problem> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'questionData',
      variables: { titleSlug },
      query: QUESTION_QUERY,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch problem: ${response.statusText}`);
  }

  const data = (await response.json()) as GraphQLResponse;

  if (!data.data?.question) {
    throw new Error(`Problem '${titleSlug}' not found`);
  }

  return data.data.question;
}
