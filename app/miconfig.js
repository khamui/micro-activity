export default {
  excludedTypes: [
    'pull-request-review',
    'pull-request-review-comment',
    'issue',
    'branch'
  ],
  providers: [
    {
      name: 'github',
      apiUrl: 'https://api.github.com/users/$githubUser/events?per_page=60',
      token: 'token $githubToken'
    },
    {
      name: 'twitter',
      apiUrl: 'https://api.twitter.com/2/users/$twitterId/tweets?tweet.fields=created_at',
      token: 'Bearer $twitterToken'
    }
  ]
}


