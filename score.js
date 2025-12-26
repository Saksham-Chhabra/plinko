const outputs = [];
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
  console.log(outputs);
}

function runAnalysis() {
  const testSetSize = 100;
  const k = 10;

  // for (let i = 0; i < testSet.length; i++) {
  //   const bucket = knn(trainingSet, testSet[i][0]);
  //   if (bucket === testSet[i][3]) {
  //     numberCorrect++;
  //   }
  //   console.log(`Actual: ${testSet[i][3]} Predicted: ${bucket}`);
  //   console.log("----");
  //   console.log("Accuracy:", numberCorrect / testSet.length);
  // }
  _.range(0, 3).forEach((feature) => {
    const data = _.map(outputs, (row) => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testSet)
      .filter(
        (testPoint) =>
          knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();
    console.log("Accuracy for feature =", feature, "is", accuracy);
  });
}

function knn(data, point, k) {
  // point has 3 labels [x,y,z]
  return _.chain(data)
    .map((row) => [distance(_.initial(row), point), _.last(row)])
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .toNumber()
    .value();
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);
  return [testSet, trainingSet];
}
function distance(pointA, pointB) {
  // point [x,y,z ....]
  return (
    _.chain(pointA)
      .zip(pointB)
      .map((pair) => (pair[0] - pair[1]) ** 2)
      .sum()
      .value() ** 0.5
  );
}

function minMax(data, featureCount) {
  const clonedData = _.cloneDeep(data);
  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map((row) => row[i]);
    const min = _.min(column);
    const max = _.max(column);
    for (let j = 0; j < clonedData.length; j++) {
      if (max - min === 0) {
        continue;
      } else {
        clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
      }
    }
  }
  return clonedData;
}
