
function FilterDic() {
  let fs = require("fs");
    const text = fs.readFileSync('dictionary.txt', "utf-8");
    let dictionary = text.split("\n");
    dictionary.splice(-1);
    let newDic = new Set();
    dictionary.forEach(
      (word, index) => {
        // console.log(word, index);
        repeat = false
        dictionary.forEach(
          word2 => {
            if (word.length > word2.length && word.startsWith(word2)) {
              repeat = true;
            }
          }
        );
        if (!repeat) {
          newDic.add(word);
        }
      }
    )
    
  console.log(newDic);
}

FilterDic()