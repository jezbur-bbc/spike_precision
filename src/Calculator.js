class Calculator {
  constructor(ruleSets, allowLists) {
    this.ruleSets = ruleSets;
    this.allowLists = allowLists;

    this.scoreModels = {
      scaled: ((score, incoming) => {
        console.log(`Scaling ${incoming.confidence} by ${score.value}`);
        return score.value * incoming.confidence;
      }),
      absolute: ((score, _) => {
        console.log(`Absolutely ${score.value}`);
        return score.value;
      }),
      allowList: ((score, incoming) => {
        console.log(`Looking up ${incoming.author} in ${score.value.list} allowList (default is ${score.value.default})`);
        return (this.allowLists[score.value.list] || {})[incoming.author] || score.value.default;
      })
    };
  }

  calculate(assertion, existing) {
    console.log('\n\n---------------------------');
    console.log(`Scoring incoming assertion: ${JSON.stringify(assertion, 2, null)}`);
    console.log(`Existing assertions: ${JSON.stringify(existing, 2, null)}`);

    const assertions = [{predicate: assertion.predicate, object: assertion.object}];

    const matchingRuleSets = getMatchingRuleSets(assertion.engine, this.ruleSets, assertions, existing);

    console.log(`\n${matchingRuleSets.length} matching rulesets`);

    matchingRuleSets.map(rs => {
      const score = this.scoreModels[rs.score.model](rs.score, assertion);
      console.log(`${rs.name} : Matches with specificity ${rs.specificity} : Score${(assertion.confidence) ? ' confidence of ' + assertion.confidence : ''} using ${rs.score.model}(${JSON.stringify(rs.score.value, 2, null) }) = ${score}`);
    });
    return "Take 1st or keep going? maybe keep feeding last score as confidence?, stop when ... rule.stop?";
  }
}

const assertionsMatchRules = (assertions, rules) => {
  const matchingRules = rules.filter(r => {
    // console.log(`\nChecking rule: ${JSON.stringify(r, 2, null)}`);

    const matchingAssertions = assertions
      .filter(m => {
        const match = r.predicate ? r.predicate == m.predicate: true;
        // console.log(`Matching predicate: ${m.predicate} = ${match}`);
        return match;
      })
      .filter(m => {
        const match = r.object ? r.object == m.object: true;
        // console.log(`Matching object: ${m.object} = ${match}`);
        return match;
      });

    // console.log(`\nMatching assertions: ${JSON.stringify(matchingAssertions, 2,  null)}`);
    return matchingAssertions.length;
  });

  // console.log(`Matching rules: ${JSON.stringify(matchingRules, 2, null)}`);
  return matchingRules;
};

const getMatchingRuleSets = (engine, ruleSets, assertions, existingAssertions) => {
  const rulesetsWithMatch = ruleSets.map(rs => {

    // console.log(`\nChecking ruleset: ${rs.name}`);

    const engineMatch = rs.engine ? engine == rs.engine : true;
    // Fail fast
    if (!engineMatch) return { ...rs, match: false, matchingRules: []};

    const rules = rs.rules || [];
    const context = rs.context || [];

    // Rules
    // console.log(`Checking assertions`);
    const rulesMatchingA = assertionsMatchRules(assertions, rules);
    // console.log(`Matched ${rulesMatchingA.length} of a possible ${rules.length}`);
    // Context
    // console.log(`Checking context`);
    const rulesMatchingC = assertionsMatchRules(existingAssertions, context);
    // console.log(`Matched ${rulesMatchingC.length} of a possible ${criteria.length}`);

    const match = rulesMatchingA.length == rules.length && rulesMatchingC.length == context.length;
    const specificity = rulesMatchingA.length + rulesMatchingC.length;
    // console.log(`Rules && criteria match: ${match}, specificity: ${specificity}`);

    return { ...rs, match, specificity };
  });

  const matchingRuleSets = rulesetsWithMatch.filter(rs => rs.match);
  return matchingRuleSets;
}


export default Calculator;