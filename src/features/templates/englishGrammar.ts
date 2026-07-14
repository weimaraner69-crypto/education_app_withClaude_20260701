import { randomInt, type Rng } from '../../lib/rng';
import type { Problem } from '../../types/problem';
import type { TemplateGenerator } from './types';

interface GrammarQuestion {
  prompt: string;
  choices: readonly [string, string, string, string];
  correctIndex: number;
  hints: Problem['hints'];
  explanation: string;
}

// 文法用語だけを問うのではなく、短い文の意味や手がかりから選ぶ問題にする。
const QUESTIONS: readonly GrammarQuestion[] = [
  {
    prompt: 'I (     ) to school by bike every day.',
    choices: ['go', 'goes', 'went', 'going'],
    correctIndex: 0,
    hints: [
      'every day は「毎日」という習慣を表すよ。',
      '主語が I の現在形では、動詞に s はつけないよ。',
      'I go to school になるよ。',
    ],
    explanation: 'every day があるので現在形。主語が I のときは go を使うよ。',
  },
  {
    prompt: 'My sister (     ) English last night.',
    choices: ['study', 'studies', 'studied', 'studying'],
    correctIndex: 2,
    hints: [
      'last night は「昨夜」で、過去のことを表すよ。',
      '規則動詞の過去形は、多くの場合 ed をつけるよ。',
      'study の過去形は studied。',
    ],
    explanation: 'last night があるので過去形。study は y を i に変えて studied になるよ。',
  },
  {
    prompt: 'It (     ) rain tomorrow.',
    choices: ['will', 'is', 'did', 'was'],
    correctIndex: 0,
    hints: [
      'tomorrow は「明日」で、これからのことを表すよ。',
      '未来のことは will + 動詞の原形で表せるよ。',
      'will rain で「雨が降るだろう」。',
    ],
    explanation: 'tomorrow があるので未来を表す will を使う。will の後は動詞の原形 rain。',
  },
  {
    prompt: 'This bag is (     ) than that one.',
    choices: ['big', 'bigger', 'biggest', 'the biggest'],
    correctIndex: 1,
    hints: [
      'than は「〜より」を表すよ。',
      '2つを比べるときは比較級を使うよ。',
      'big の比較級は bigger。',
    ],
    explanation: 'than があるので比較級。big は最後の文字を重ねて bigger になるよ。',
  },
  {
    prompt: 'I want (     ) a doctor.',
    choices: ['be', 'to be', 'being', 'am'],
    correctIndex: 1,
    hints: [
      'want は「〜したい」という意味だよ。',
      'want の後は to + 動詞の原形を使うよ。',
      'to be a doctor で「医者になりたい」。',
    ],
    explanation: 'want to + 動詞の原形で「〜したい」。want to be a doctor となるよ。',
  },
  {
    prompt: 'Look! The dog (     ) over there.',
    choices: ['run', 'runs', 'ran', 'is running'],
    correctIndex: 3,
    hints: [
      'Look! は、今見えていることに注目するときに使うよ。',
      '今していることは be動詞 + ing形で表すよ。',
      'The dog is running になるよ。',
    ],
    explanation: 'Look! があるので現在進行形。The dog is running で「犬が走っている」。',
  },
  {
    prompt: 'You (     ) follow the rules.',
    choices: ['must', 'are', 'did', 'were'],
    correctIndex: 0,
    hints: [
      '「〜しなければならない」という意味を考えよう。',
      '助動詞の後は動詞の原形を使うよ。',
      'must follow で「従わなければならない」。',
    ],
    explanation: 'must は「〜しなければならない」。must の後は follow のように動詞の原形を置くよ。',
  },
  {
    prompt: 'I have a friend (     ) lives in Canada.',
    choices: ['who', 'what', 'when', 'where'],
    correctIndex: 0,
    hints: [
      '先行詞は a friend、人を表す言葉だよ。',
      '人を説明する文につなぐときは who を使えるよ。',
      'who lives in Canada で「カナダに住んでいる人」。',
    ],
    explanation: 'a friend は人なので who を使う。who lives in Canada が friend を説明しているよ。',
  },
];

// 英文法（中2）のテンプレート。文の手がかりから適切な語句を選ぶ。
export const englishGrammarTemplate: TemplateGenerator = {
  key: 'english-grammar',
  subjectId: 'english',
  gradeId: 'g-jhs2',
  unitId: 'jhs2-english-grammar',
  generate(rng?: Rng): Problem {
    const question = QUESTIONS[randomInt(0, QUESTIONS.length - 1, rng)];
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: '（     ）に入るもっともよい語句を選ぼう。\n' + question.prompt,
      choices: [...question.choices],
      answer: { format: 'choice', correctIndex: question.correctIndex },
      hints: question.hints,
      explanation: question.explanation,
      difficulty: 3,
    };
  },
};
