import { AADAuthGuard } from "./aad-auth.guard";

describe('AadAuthGuard', () => {
  it('should be defined', () => {
    expect(new AADAuthGuard()).toBeDefined();
  });
});
