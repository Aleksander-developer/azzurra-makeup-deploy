import { FileToUrlPipe } from './file-to-url.pipe';

describe('FileToUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new FileToUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
