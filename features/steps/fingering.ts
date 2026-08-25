import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

When('五線譜の {string} を選ぶ', async ({ page }, name: string) => {
  await page.getByRole('button', { name, exact: true }).click()
})

Then('キー {string} が押さえた状態で表示される', async ({ page }, keys: string) => {
  for (const key of keys.split(',').map((k) => k.trim())) {
    await expect(page.locator(`[data-key="${key}"]`)).toHaveAttribute('data-pressed', 'true')
  }
})

Then('キー {string} は離した状態で表示される', async ({ page }, keys: string) => {
  for (const key of keys.split(',').map((k) => k.trim())) {
    await expect(page.locator(`[data-key="${key}"]`)).toHaveAttribute('data-pressed', 'false')
  }
})

Then('選択中の音名 {string} が表示される', async ({ page }, name: string) => {
  await expect(page.getByTestId('selected-note')).toHaveText(name)
})
