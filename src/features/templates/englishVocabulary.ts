import { randomInt, type Rng } from '../../lib/rng';
import type { Problem } from '../../types/problem';
import type { TemplateGenerator } from './types';

interface VocabularyWord {
  english: string;
  japanese: string;
  example: string;
  clue: string;
}

// 教科書固有の単語帳には依存せず、中2で使う基本語をオリジナルの問題セットとして用意する。
const WORDS: readonly VocabularyWord[] = [
  {
    english: 'borrow',
    japanese: '借りる',
    example: 'Can I borrow your pen?',
    clue: '人の物を一時的に使わせてもらう',
  },
  {
    english: 'bring',
    japanese: '持ってくる',
    example: 'Please bring your notebook.',
    clue: 'こちらへ物を持ってくる',
  },
  {
    english: 'choose',
    japanese: '選ぶ',
    example: 'Choose one color.',
    clue: 'いくつかの中から一つ決める',
  },
  {
    english: 'different',
    japanese: '異なる',
    example: 'My idea is different from yours.',
    clue: '同じではない',
  },
  {
    english: 'enough',
    japanese: '十分な',
    example: 'We have enough time.',
    clue: '必要な量が足りている',
  },
  {
    english: 'foreign',
    japanese: '外国の',
    example: 'She wants to visit a foreign country.',
    clue: '自分の国ではない国に関する',
  },
  {
    english: 'important',
    japanese: '大切な',
    example: 'It is important to help others.',
    clue: 'とても大事だ',
  },
  {
    english: 'invite',
    japanese: '招待する',
    example: 'I will invite my friend to the party.',
    clue: '集まりなどに来るように誘う',
  },
  {
    english: 'language',
    japanese: '言語',
    example: 'English is used in many countries.',
    clue: '人が考えや気持ちを伝えるために使う言葉',
  },
  {
    english: 'popular',
    japanese: '人気のある',
    example: 'This song is popular with students.',
    clue: '多くの人に好かれている',
  },
  {
    english: 'practice',
    japanese: '練習する',
    example: 'We practice English after school.',
    clue: '上達するためにくり返し行う',
  },
  {
    english: 'travel',
    japanese: '旅行する',
    example: 'They will travel to Kyoto next week.',
    clue: '遠くの場所へ出かける',
  },
];

function choicesFor(
  wordIndex: number,
  correctIndex: number,
  value: (word: VocabularyWord) => string,
): string[] {
  const choices = Array.from({ length: 4 }, () => '');
  choices[correctIndex] = value(WORDS[wordIndex]);

  let nextWordIndex = wordIndex + 1;
  for (let index = 0; index < choices.length; index += 1) {
    if (index === correctIndex) continue;
    choices[index] = value(WORDS[nextWordIndex % WORDS.length]);
    nextWordIndex += 1;
  }

  return choices;
}

// 英単語（中2）のテンプレート。英語から意味、日本語から英語を交互に確かめる。
export const englishVocabularyTemplate: TemplateGenerator = {
  key: 'english-vocabulary',
  subjectId: 'english',
  gradeId: 'g-jhs2',
  unitId: 'jhs2-english-vocabulary',
  generate(rng?: Rng): Problem {
    const wordIndex = randomInt(0, WORDS.length - 1, rng);
    const fromJapanese = randomInt(0, 1, rng) === 1;
    const correctIndex = randomInt(0, 3, rng);
    const word = WORDS[wordIndex];
    const choices = choicesFor(wordIndex, correctIndex, (item) =>
      fromJapanese ? item.english : item.japanese,
    );
    const prompt = fromJapanese
      ? `「${word.japanese}」にあう英語を選ぼう。例：${word.example}`
      : `「${word.english}」の意味を選ぼう。例：${word.example}`;

    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt,
      choices,
      answer: { format: 'choice', correctIndex },
      hints: [
        `ヒント：${word.clue}ときに使う言葉だよ。`,
        `英語は「${word.english.charAt(0)}」で始まるよ。`,
        `「${word.english}」は「${word.japanese}」という意味。`,
      ],
      explanation: `例文「${word.example}」では、「${word.english}」は「${word.japanese}」という意味で使われているよ。`,
      difficulty: 2,
    };
  },
};
