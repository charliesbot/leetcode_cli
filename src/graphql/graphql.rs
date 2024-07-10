use anyhow::Result;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;

const GRAPHQL_URL: &str = "https://leetcode.com/graphql";
const QUESTION_QUERY_STRING: &str = r#"
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
}"#;

#[derive(Debug, Serialize, Deserialize)]
struct Query {
    #[serde(rename = "operationName")]
    operation_name: String,
    variables: serde_json::Value,
    query: String,
}

#[derive(Debug, Deserialize)]
struct QuestionResponse {
    data: QuestionData,
}

#[derive(Debug, Deserialize)]
struct QuestionData {
    question: Question,
}

#[derive(Debug, Deserialize)]
pub struct Question {
    pub questionId: String,
    pub questionFrontendId: String,
    pub title: String,
    pub titleSlug: String,
    pub content: String,
    pub difficulty: String,
    pub codeSnippets: Vec<CodeSnippet>,
    pub exampleTestcases: String,
    pub sampleTestCase: String,
    pub metaData: String,
}

#[derive(Debug, Deserialize)]
pub struct CodeSnippet {
    pub lang: String,
    pub langSlug: String,
    pub code: String,
}

pub async fn fetch_question(problem_identifier: &str) -> Result<Question> {
    let client = Client::new();

    let query = Query {
        operation_name: "questionData".to_string(),
        variables: json!({ "titleSlug": problem_identifier }),
        query: QUESTION_QUERY_STRING.to_string(),
    };

    let res = client
        .post(GRAPHQL_URL)
        .json(&query)
        .send()
        .await?
        .json::<QuestionResponse>()
        .await?;

    Ok(res.data.question)
}
