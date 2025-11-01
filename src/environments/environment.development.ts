export const environment = {
  production: false,
  logoPath: 'logo.png',
  baseUrl: '',
  darkLogoPath: 'logo.png',
 apiBaseUrl: 'https://job-portal-rcxk.onrender.com',

  getUrl: (method: string, module_entity: string = "accounts"): string => {
    return environment.apiBaseUrl + "/api/" + module_entity + "/" + method + "/";
  },

 devToken: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0SFhjOHhrMXRncVgyRmVUTlJTSzZqTlMyQ0VkdVVIQlRpNm5IWjR2ejk4In0.eyJleHAiOjE3NTk4MTUwMDQsImlhdCI6MTc1OTU4NDYwNCwianRpIjoiZjFiZGJiMWQtNmVkNS00MzEyLWE5YjMtZmY3NGEwNDA4MTEwIiwiaXNzIjoiaHR0cHM6Ly9vYXV0aC5ib2FyZC5vc2FuZWQuY29tL3JlYWxtcy82ZmE4NWY2NC01NzE3LTQ1NjItYjNmYy0yYzk2M2Y2NmFmYTYiLCJzdWIiOiJmZjhhODAxMC1jNzIyLTQ2YzYtYjlkNS03MzNiOWJlMmVjZGYiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJzYW5lZC1hcGktZ2F0ZXdheS1jbGllbnQiLCJzZXNzaW9uX3N0YXRlIjoiMzQ4NjI4ODItMzQ4My00Zjc4LWExMTUtNDM3ODg0ZjdjOTE4IiwiYWNyIjoiMSIsInNjb3BlIjoicm9sZXMgZW1haWwiLCJzaWQiOiIzNDg2Mjg4Mi0zNDgzLTRmNzgtYTExNS00Mzc4ODRmN2M5MTgiLCJyb2xlcyI6WyJzeXN0ZW1BZG1pbiIsIkhEX0FkbWluIiwiSFJfQWRtaW4iXSwiZW1haWwiOiJhaG1lZC5tYWRoZXJAZGF0YXRyYW5zLWl0LmNvbSJ9.XFmr7XC2Cu0xbrYByXbkrKKAv62brSbVAIEwWQ8RI3uRZv0Mze7Q60bcfGVidPZMuCKduZ9sj4F4b91fcO6uMfbGpxWqDpPY1tfjryQewxO3u72yRbwge1vCmfzqvWVoLzmt6JPzC7ON7mQhIIgLPSSMBsS813a4Z9Bd33jy0lltA2garvrDXesQl66jBrAWkAxuoAxowh6lWUVlxX6V0fvX90f0pfMBsWDxp-fRksGdKVNRkpL5O11YrX2qVWfc4UOSnJndGvaUZcZF_CTPx4tZoWYpIxBwd1XqJVKuRaKSmTZLrHV5emBOqEY0GH2Mmdt5iNxCSiU0zO4UQ_aleQ",

};

 export function getBaseDomain():string{
    const host = window.location.origin.split('://')[1];
    const subdomainList = host.split('.');
    if (subdomainList.length > 2) {
      return subdomainList.slice(1).join('.');
    }else{
      return 'alyaarihazem.github.io/portfolio';
    }
  }
