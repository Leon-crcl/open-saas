import { expect, test, type Page } from "@playwright/test";
import { createRandomUser, logUserIn, signUserUp, type User } from "./utils";

let page: Page;
let testUser: User;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  testUser = createRandomUser();
  await signUserUp({ page, user: testUser });
  await logUserIn({ page, user: testUser });
});

test.afterAll(async () => {
  await page.close();
});

async function addSupplier({
  name,
  price,
  quality,
  deliveryDays,
  risk,
}: {
  name: string;
  price: string;
  quality: string;
  deliveryDays: string;
  risk: string;
}) {
  await page.getByRole("button", { name: "Add supplier" }).first().click();
  await page.getByLabel("Supplier name").fill(name);
  await page.getByLabel("Price per unit").fill(price);
  await page.getByLabel("Quality").fill(quality);
  await page.getByLabel("Delivery time").fill(deliveryDays);
  await page.getByLabel("Risk").fill(risk);
  await page.getByRole("button", { name: "Save supplier" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.getByTestId("supplier-ranking")).toContainText(name);
}

test("New user starts on the supplier analyzer with an empty state", async () => {
  expect(page.url()).toContain("/supplier-analyzer");
  await expect(page.getByText("No suppliers yet")).toBeVisible();
});

test("User can add suppliers and the best one is ranked first", async () => {
  await addSupplier({
    name: "Budget Parts Ltd",
    price: "4",
    quality: "40",
    deliveryDays: "30",
    risk: "70",
  });
  await addSupplier({
    name: "Premium Components",
    price: "9",
    quality: "95",
    deliveryDays: "5",
    risk: "10",
  });

  const rows = page.getByTestId("supplier-row");
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toContainText("Premium Components");
});

test("User can delete a supplier", async () => {
  await page.getByRole("button", { name: "Actions for Budget Parts Ltd" }).click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete supplier" }).click();
  await expect(page.getByTestId("supplier-row")).toHaveCount(1);
});

test("Free plan blocks adding more than 5 suppliers", async () => {
  for (let i = 0; i < 4; i++) {
    await addSupplier({
      name: `Filler Supplier ${i}`,
      price: "5",
      quality: "50",
      deliveryDays: "10",
      risk: "50",
    });
  }
  await expect(page.getByTestId("supplier-row")).toHaveCount(5);
  await expect(
    page.getByRole("button", { name: "Add supplier" }).first(),
  ).toBeDisabled();
});
