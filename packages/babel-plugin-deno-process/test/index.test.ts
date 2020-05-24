import {
  getNodeFiles, readTranspileAndWrite, nodeRun, denoRun,
} from './test.utils';

const nodeFileNames: string[] = getNodeFiles();

// @ts-ignore nodeFileNames is being used before it is defined
for (const fileName of nodeFileNames) {
  test(`snapshot: transpiled ${fileName}.mjs matches ${fileName}.deno.js`, async () => {
    const {
      denoResult,
    } = await readTranspileAndWrite(fileName);

    expect(denoResult.code).toMatchSnapshot();
    expect(denoResult.ast).toMatchSnapshot();

    // expect((await nodeRun(fileName)).stdout).toBe(
    //   (await denoRun(fileName)).stdout,
    // );
  });
}
