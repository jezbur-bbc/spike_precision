const ruleSets = [
  {
    name: "Humans know best about stuff",
    engine: "PC",
    rules: [
      {
        predicate: "about"
      },
    ],
    score: {
      model: "absolute",
      value: 1.0
    }
  },
  {
    name: "Starfruit mentions anything already in sounds",
    engine: "starfruit",
    context: [
      {
        predicate: "home",
        object: "sounds"
      }
    ],
    rules: [
      {
        predicate: "mentions"
      }
    ],
    score: {
      model: "scaled",
      precendence: 5,
      value: 0.9,
      stopAfter: true
    }
  },
  {
    name: "Starfruit mentions anything",
    engine: "starfruit",
    rules: [
      {
        predicate: "mentions"
      }
    ],
    score: {
      model: "scaled",
      value: 0.8
    }
  },
  {
    name: "Only some people can say suitable for all",
    engine: "PC",
    rules: [
      {
        predicate: "suitableFor",
        object: "all"
      }
    ],
    score: {
      model: "allowList",
      value: {
        list: "childrens",
        "default": -1.0
      }
    }
  }
];

export default ruleSets;

