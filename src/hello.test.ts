import { hello } from "./hello";

describe("Test hello.ts", () => {
  it('Should output "Hello World >:)"', () => {
    expect(hello()).toBe("Hello World >:)");
  });
});
