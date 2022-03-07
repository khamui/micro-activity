const twitterApiUrl =
  "https://api.twitter.com/2/users/$twitterId/tweets?tweet.fields=created_at";
const githubApiUrl =
  "https://api.github.com/users/$githubUser/events?per_page=100";

const config = {
  excludedTypes: [
    "pull-request",
    "pull-request-review",
    "pull-request-review-comment",
    "issue",
    "branch",
  ],
  providers: [
    {
      name: "github",
      apiUrl: githubApiUrl,
      token: "token $githubToken",
    },
    {
      name: "twitter",
      apiUrl: twitterApiUrl,
      token: "Bearer $twitterToken",
    },
  ],
};

export default config;
