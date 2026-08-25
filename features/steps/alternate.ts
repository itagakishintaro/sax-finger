import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { When, Then } = createBdd()

When('運指 {string} を選ぶ', async ({ page }, label: string) => {
  await page.getByRole('group', { name: '運指' }).getByRole('button', { name: label }).click()
})

Then('運指切替は表示されない', async ({ page }) => {
  await expect(page.getByRole('group', { name: '運指' })).toHaveCount(0)
})
