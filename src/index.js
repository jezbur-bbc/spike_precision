import ruleSets from './data/ruleSets';
import allowLists from './data/allowLists';
import Calculator from './Calculator'

const existingPassportAssertions = [
  {
    predicate: "about",
    object: "boris"
  },
  {
    predicate: "suitableFor",
    object: "all"
  },
  {
    predicate: "home",
    object: "sounds"
  }
];

const calculator = new Calculator(ruleSets, allowLists);

calculator.calculate({
  engine: "starfruit",
  predicate: "mentions",
  object: "boris",
  confidence: 0.5
}, existingPassportAssertions);

calculator.calculate({
  engine: "PC",
  predicate: "about",
  object: "anything else",
}, existingPassportAssertions);

calculator.calculate({
  engine: "PC",
  predicate: "about",
  object: "Boris",
}, existingPassportAssertions);

calculator.calculate({
  engine: "PC",
  predicate: "suitableFor",
  object: "all",
  author: "alice",
}, existingPassportAssertions);

calculator.calculate({
  engine: "PC",
  predicate: "suitableFor",
  object: "all",
  author: "tom"
}, existingPassportAssertions);
