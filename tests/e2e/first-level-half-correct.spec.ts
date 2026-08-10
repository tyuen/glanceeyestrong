import { expect, test } from '@playwright/test';

const levelOneAnswerCount = 3;
const answeredRounds = 10;
const expectedCorrectAnswers = answeredRounds / 2;

test('plays the first level with only half of the answers correct', async ({
  page,
}) => {
  await page.clock.install();

  await page.route('**/api/init', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        type: 'init',
        postId: 'playwright-post',
        scores: [],
        global_scores: [],
        username: 'playwright-user',
      },
    });
  });

  await page.route('**/api/scores', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      json: {
        type: 'scores-saved',
        scores: [expectedCorrectAnswers],
        global_scores: [expectedCorrectAnswers],
      },
    });
  });

  await page.goto('/src/client/Play.html');
  await page.clock.fastForward(1500);

  const score = page.getByTestId('current-score').getByText('0');
  await expect(score).toBeVisible();

  for (let round = 0; round < answeredRounds; round += 1) {
    const currentEmojiIndex = Number(
      await page.getByTestId('current-round-emoji').getAttribute('data-emoji-index')
    );
    const answerIndex =
      round % 2 === 0
        ? currentEmojiIndex
        : (currentEmojiIndex + 1) % levelOneAnswerCount;

    await page.getByTestId(`answer-choice-${answerIndex}`).click();
    await page.clock.fastForward(2000);
    await expect(page.getByTestId('answer-choice-0')).toBeEnabled();
  }

  await expect(page.getByTestId('current-score')).toContainText(
    String(expectedCorrectAnswers)
  );

  await page.clock.fastForward(80_000);

  await expect(page.getByText('Level 1 Score')).toBeVisible();
  await expect(page.getByRole('heading', { name: '5' })).toBeVisible();
});
