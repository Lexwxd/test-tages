import { createWriteStream, createReadStream } from 'fs';
import { createInterface } from 'node:readline';

async function main() {
   let lineIndexArr = []
   const writeStream = createWriteStream("sorted.txt");
   while (true) {
      const readStream = createReadStream('unsorted.txt')
      const rl = createInterface({
         input: readStream,
         crlfDelay: Infinity,
      });

      let bufferStringForWrite = { data: null, index: 0 }
      let index = 1
      for await (const line of rl) {
         if (!lineIndexArr.includes(index) && (bufferStringForWrite.data == null || line.localeCompare(bufferStringForWrite.data) < 0)) {
            console.log(line)
            bufferStringForWrite = { data: line, index: index }
         }
         index++
      }
      lineIndexArr.push(bufferStringForWrite.index)
      
      const breakCase = (lineIndexArr.length == Math.max(...lineIndexArr))
      writeStream.write(`${bufferStringForWrite.data}` + (breakCase == false ? '\n' : ''));
      rl.close()
      readStream.close()
      if (breakCase) {
         break
      }
   }
   writeStream.end()
   console.log('Done')
}

main()