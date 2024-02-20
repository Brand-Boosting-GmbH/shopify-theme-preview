import * as core from '@actions/core'
//import * as exec from '@actions/exec'
import { Octokit } from '@octokit/rest'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const SHOPIFY_FLAG_STORE = core.getInput('shopify_flag_store', {
      required: true
    })
    /*const SHOPIFY_CLI_THEME_TOKEN = core.getInput('shopify_cli_theme_token', {
      required: true
    })
    const BUILD_STEP = core.getInput('build_step', { required: false })
    const DIR = core.getInput('dir', { required: false })*/
    const TIMEZONE = core.getInput('timezone', { required: false })
    const REPOSITORY = core.getInput('repository', { required: true })
    const PULL_REQUEST_NUMBER = parseInt(
      core.getInput('pull_request_number', {
        required: true
      })
    )

    // get time and date with timezone

    const date = new Date().toLocaleDateString('de-DE', {
      timeZone: TIMEZONE,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })

    // get time and date with timezone
    const time = new Date().toLocaleTimeString('de-DE', {
      timeZone: TIMEZONE,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })

    const octokit = new Octokit({ auth: 'YOUR_GITHUB_TOKEN' })
    const owner = REPOSITORY.split('/')[0]
    const repo = REPOSITORY.split('/')[1]

    /*const { data } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: PULL_REQUEST_NUMBER
    })*/

    // iterate over all comments
    const comments = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: PULL_REQUEST_NUMBER,
      page: 1,
      per_page: 100
    })

    // check if the comment already exists
    const comment = comments.data.find(comment => {
      if (!comment.body) return false
      return comment.body.includes('Shopify Theme Preview')
    })

    if (comment) {
      core.info(`Comment already exists: ${comment.id}`)
      return
    }

    // Create a new comment
    const commentBody = `Shopify Theme Preview

| Name | Status | Preview | Editor | Date | Time |
| :--- | :----- | :------ | :------ | :------ | :----- |
| ${SHOPIFY_FLAG_STORE} | 🔄 Loading |  |  | ${date} | ${time}

*created by Brand Boosting GmbH * [View on GitHub Marketplace](https://github.com/marketplace/actions/create-shopify-theme-preview)`

    const commentId = await createComment(
      octokit,
      owner,
      repo,
      PULL_REQUEST_NUMBER,
      commentBody
    )

    // Set the comment ID as an output
    core.setOutput('comment_id', commentId)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function createComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
): Promise<number> {
  body = truncateBody(body)

  const { data: comment } = await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body
  })
  core.info(`Created comment id '${comment.id}' on issue '${issueNumber}'.`)
  return comment.id
}

function truncateBody(body: string): string {
  // 65536 characters is the maximum allowed for issue comments.
  const truncateWarning = '...*[Comment body truncated]*'
  if (body.length > 65536) {
    core.warning(`Comment body is too long. Truncating to 65536 characters.`)
    return body.substring(0, 65536 - truncateWarning.length) + truncateWarning
  }
  return body
}
/*
async function updateComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  commentId: number,
  body: string,
  editMode: string,
  appendSeparator: string
): Promise<number> {
  if (body) {
    let commentBody = ''
    if (editMode == 'append') {
      // Get the comment body
      const { data: comment } = await octokit.rest.issues.getComment({
        owner,
        repo,
        comment_id: commentId
      })
      commentBody = appendSeparatorTo(
        comment.body ? comment.body : '',
        appendSeparator
      )
    }
    commentBody = truncateBody(commentBody + body)
    core.debug(`Comment body: ${commentBody}`)
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body: commentBody
    })
    core.info(`Updated comment id '${commentId}'.`)
  }
  return commentId
}

function appendSeparatorTo(body: string, separator: string): string {
  switch (separator) {
    case 'newline':
      return `${body}\n`
    case 'space':
      return `${body} `
    default: // none
      return body
  }
}*/
