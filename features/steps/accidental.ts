import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

When('変化記号 {string} を選ぶ', async ({ page }, mark: string) => {
  await page.getByRole('group', { name: '変化記号' }).getByRole('button', { name: mark }).click()
})

Then('異名同音 {string} が併記される', async ({ page }, name: string) => {
  await expect(page.getByTestId('enharmonic-note')).toHaveText(`（= ${name}）`)
})

Then('すべてのキーが離した状態で表示される', async ({ page }) => {
  await expect(page.locator('[data-pressed="true"]')).toHaveCount(0)
  await expect(page.locator('[data-pressed="false"]').first()).toBeVisible()
})

Then('五線譜の {string} は無効表示である', async ({ page }, name: string) => {
  await expect(page.getByRole('button', { name, exact: true })).toHaveAttribute(
    'aria-disabled',
    'true',
  )
})
