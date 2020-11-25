const fs = require('fs');

export const readFromFile = <T extends {}>(
  path: string,
  callback: (data: T[]) => Promise<void>
) => {
  fs.readFile(path, (err: any, data: Buffer) => {
    if (err) {
      console.log('error while proccessing file');
      return;
    }

    callback((JSON.parse(data.toString()) as any) as T[]);
  });
};
