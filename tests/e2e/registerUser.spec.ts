import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hub de Leitura/);
});

test('Register new user', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: /Criar Conta/i }).click();
  await expect(page).toHaveURL(/login/)
  
  await page.getByRole('link', { name: /Criar Conta/i }).click();

  const TITLE = 'Preencha todos os campos para Criar Conta'
  await expect(page.locator('.register-header')
                     .locator('..')
                     .getByRole('heading', { name: TITLE })).toBeVisible();
  
})