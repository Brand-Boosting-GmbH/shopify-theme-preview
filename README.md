# Create Shopify Theme Preview

This GitHub action creates a preview of a pull request for a Shopify store. It makes it easier to see the changes made in a pull request before they are merged.

The action has the following steps:

1. Get the current date and time
2. Create a comment on the pull request for the loading state with a table containing the name of the store, the status of the preview creation, and the date and time of the action
3. Check out the current pull request
4. Set up Node.js and Ruby
5. Install the Shopify CLI
6. Use the Shopify CLI to create the preview and save the returned preview link in an output object
7. Update the table to display the preview links
8. If any of the previous steps fail, create a comment on the pull request with an error message


## Inputs
| Name | Description | Example |
| ---- | ----------- | ------- |
| `shopify_flag_store` | Your Store URL | `your-store.myshopify.com` | 
| `shopify_cli_theme_token` | Password generated from [Theme Access App](https://shopify.dev/themes/tools/theme-access) | `shptka_7e95eace43t00be7f9f8612325212805` |


## Example usage

### Create a preview link and add it to the comment
The action searches for the `!preview` keyword in a pull request comment and replaces the entire comment with a table that includes a preview and editor link. The keyword can be changed to filter for a different string in the pull request comments. Remember to generate a `shopify_cli_theme_token` for the repository and pass it to the input of this action, along with the `shopify_flag_store`, which is your store URL.

```yaml
run-name: Create Theme Preview by @${{ github.actor }}
on:
  issue_comment:      
    types: [created]    
jobs:                   
  deploy:
    name: Preview
    runs-on: ubuntu-latest
    if: contains(github.event.comment.body, '!preview')
    steps:
      - uses: Brand-Boosting-GmbH/shopify-theme-preview@v3
        with:
          shopify_flag_store: 'your-store.myshopify.com'
          shopify_cli_theme_token: 'shopify_cli_theme_token'
```
<p>Just write a comment like this:</p>

![image](https://user-images.githubusercontent.com/77160493/206173680-5e960d83-807d-4205-9d25-b962e6a30091.png)

<p>After the action finished loading, the table with the preview links should look like this:</p>

![image](https://user-images.githubusercontent.com/77160493/206173320-c68ae50a-5afa-48d7-bb70-690612cd1d58.png)

---
<div style="display: inline">
  <img width="280" alt="wort-bild-primary@2x" src="https://user-images.githubusercontent.com/77160493/206194969-10dc2ed8-476d-4639-865e-75c9028109a4.png">
  <div>
    <b>Brand Boosting GmbH</b> |
    <b>David Süßlin</b>
  </div>
</div>
