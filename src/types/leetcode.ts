export interface CodeSnippet {
  lang: string;
  langSlug: string;
  code: string;
}

export interface Problem {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  content: string;
  difficulty: string;
  codeSnippets: CodeSnippet[];
  exampleTestcases: string;
  sampleTestCase: string;
  metaData: string;
}

export interface GraphQLResponse {
  data: {
    question: Problem;
  };
}
