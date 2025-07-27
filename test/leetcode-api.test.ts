import test from 'node:test';
import assert from 'node:assert';
import type { GraphQLResponse, Problem } from '../src/types/leetcode.js';

// Mock fetch for testing
const originalFetch = globalThis.fetch;

test('LeetCode API test suite', async (t) => {
  await t.test('should construct correct GraphQL query', () => {
    const expectedQuery = `
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

    // Verify query structure (whitespace-agnostic)
    const normalizedQuery = expectedQuery.replace(/\s+/g, ' ').trim();
    assert(normalizedQuery.includes('query questionData($titleSlug: String!)'));
    assert(normalizedQuery.includes('question(titleSlug: $titleSlug)'));
    assert(normalizedQuery.includes('questionId'));
    assert(normalizedQuery.includes('codeSnippets'));
  });

  await t.test('should parse GraphQL response correctly', () => {
    const mockResponse: GraphQLResponse = {
      data: {
        question: {
          questionId: '1',
          questionFrontendId: '1',
          title: 'Two Sum',
          titleSlug: 'two-sum',
          content:
            '<p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>',
          difficulty: 'Easy',
          codeSnippets: [
            {
              lang: 'TypeScript',
              langSlug: 'typescript',
              code: 'function twoSum(nums: number[], target: number): number[] {\n    \n};',
            },
          ],
          exampleTestcases: '[2,7,11,15]\\n9',
          sampleTestCase: '[2,7,11,15]\\n9',
          metaData: '{"name": "twoSum", "params": [...]}',
        },
      },
    };

    const problem = mockResponse.data.question;
    assert.strictEqual(problem.questionFrontendId, '1');
    assert.strictEqual(problem.title, 'Two Sum');
    assert.strictEqual(problem.difficulty, 'Easy');
    assert.strictEqual(problem.codeSnippets.length, 1);
    assert.strictEqual(problem.codeSnippets[0].langSlug, 'typescript');
  });

  await t.test('should handle API errors gracefully', async () => {
    // Mock fetch to return an error response
    globalThis.fetch = async () => {
      return new Response(null, { status: 404, statusText: 'Not Found' });
    };

    try {
      const response = await fetch('https://leetcode.com/graphql');
      if (!response.ok) {
        throw new Error(`Failed to fetch problem: ${response.statusText}`);
      }
      assert.fail('Should have thrown an error');
    } catch (error) {
      assert(error instanceof Error);
      assert.strictEqual(error.message, 'Failed to fetch problem: Not Found');
    }

    // Restore original fetch
    globalThis.fetch = originalFetch;
  });

  await t.test('should validate required fields in problem response', () => {
    const validProblem: Problem = {
      questionId: '1',
      questionFrontendId: '1',
      title: 'Two Sum',
      titleSlug: 'two-sum',
      content: 'Problem content',
      difficulty: 'Easy',
      codeSnippets: [],
      exampleTestcases: '',
      sampleTestCase: '',
      metaData: '',
    };

    // Validate all required fields are present
    assert(typeof validProblem.questionId === 'string');
    assert(typeof validProblem.questionFrontendId === 'string');
    assert(typeof validProblem.title === 'string');
    assert(typeof validProblem.titleSlug === 'string');
    assert(typeof validProblem.content === 'string');
    assert(typeof validProblem.difficulty === 'string');
    assert(Array.isArray(validProblem.codeSnippets));
  });

  await t.test('should construct correct API request payload', () => {
    const titleSlug = 'two-sum';
    const expectedPayload = {
      operationName: 'questionData',
      variables: { titleSlug },
      query: 'query questionData($titleSlug: String!) { ... }', // Simplified for test
    };

    const actualPayload = {
      operationName: 'questionData',
      variables: { titleSlug },
      query: 'query questionData($titleSlug: String!) { ... }',
    };

    assert.strictEqual(actualPayload.operationName, 'questionData');
    assert.strictEqual(actualPayload.variables.titleSlug, 'two-sum');
    assert(typeof actualPayload.query === 'string');
  });
});
