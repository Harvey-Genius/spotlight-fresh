/**
 * Gmail API Client
 * Uses OAuth access token to interact with Gmail API
 */

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

/**
 * List emails from inbox
 * @param {string} accessToken - OAuth access token with Gmail scope
 * @param {object} options - Query options
 * @returns {Promise<Array>} List of email messages
 */
export async function listEmails(accessToken, { maxResults = 20, query = '' } = {}) {
  const params = new URLSearchParams({
    maxResults: maxResults.toString(),
  })

  if (query) {
    params.set('q', query)
  }

  const response = await fetch(`${GMAIL_API_BASE}/messages?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status}`)
  }

  const data = await response.json()
  return data.messages || []
}

/**
 * Get full email details (with retry for rate limits)
 * @param {string} accessToken - OAuth access token
 * @param {string} messageId - Email message ID
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<object>} Full email message
 */
export async function getEmail(accessToken, messageId, retries = 3) {
  const response = await fetch(`${GMAIL_API_BASE}/messages/${messageId}?format=full`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  // Handle rate limiting with retry
  if (response.status === 429 && retries > 0) {
    const delay = (4 - retries) * 1000 // 1s, 2s, 3s backoff
    await new Promise(resolve => setTimeout(resolve, delay))
    return getEmail(accessToken, messageId, retries - 1)
  }

  if (!response.ok) {
    throw new Error(`Gmail API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Get multiple emails by IDs (with rate limiting)
 * @param {string} accessToken - OAuth access token
 * @param {string[]} messageIds - Array of message IDs
 * @returns {Promise<Array>} Array of full email messages
 */
export async function getEmails(accessToken, messageIds) {
  const emails = []
  const batchSize = 25 // Fetch 25 at a time

  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize)
    const batchEmails = await Promise.all(
      batch.map(id => getEmail(accessToken, id))
    )
    emails.push(...batchEmails)

    // Small delay between batches to avoid rate limits
    if (i + batchSize < messageIds.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return emails
}

/**
 * Search emails with query
 * @param {string} accessToken - OAuth access token
 * @param {string} query - Gmail search query
 * @param {number} maxResults - Maximum results to return
 * @returns {Promise<Array>} Array of matching emails with full content
 */
export async function searchEmails(accessToken, query, maxResults = 10) {
  const messages = await listEmails(accessToken, { query, maxResults })

  if (messages.length === 0) {
    return []
  }

  // Get full content for each message
  const emails = await getEmails(
    accessToken,
    messages.map(m => m.id)
  )

  return emails.map(parseEmail)
}

/**
 * Parse email message into a cleaner format
 * @param {object} message - Raw Gmail message
 * @returns {object} Parsed email
 */
export function parseEmail(message) {
  const headers = message.payload?.headers || []

  const getHeader = (name) =>
    headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''

  // Get email body
  let body = ''
  const parts = message.payload?.parts || []

  if (message.payload?.body?.data) {
    body = decodeBase64(message.payload.body.data)
  } else if (parts.length > 0) {
    // Find text/plain part first, then text/html
    const textPart = parts.find(p => p.mimeType === 'text/plain')
    const htmlPart = parts.find(p => p.mimeType === 'text/html')

    if (textPart?.body?.data) {
      body = decodeBase64(textPart.body.data)
    } else if (htmlPart?.body?.data) {
      body = stripHtml(decodeBase64(htmlPart.body.data))
    }
  }

  return {
    id: message.id,
    threadId: message.threadId,
    snippet: message.snippet,
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    body: body.trim(),
    labels: message.labelIds || [],
  }
}

/**
 * Decode base64url encoded string
 */
function decodeBase64(data) {
  try {
    // Replace URL-safe chars and decode
    const base64 = data.replace(/-/g, '+').replace(/_/g, '/')
    return atob(base64)
  } catch {
    return ''
  }
}

/**
 * Strip HTML tags from string
 */
function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

/**
 * Get recent emails summary
 * @param {string} accessToken - OAuth access token
 * @param {number} count - Number of emails to summarize
 * @returns {Promise<Array>} Array of parsed recent emails
 */
export async function getRecentEmails(accessToken, count = 10) {
  const messages = await listEmails(accessToken, { maxResults: count })

  if (messages.length === 0) {
    return []
  }

  const emails = await getEmails(accessToken, messages.map(m => m.id))
  return emails.map(parseEmail)
}
