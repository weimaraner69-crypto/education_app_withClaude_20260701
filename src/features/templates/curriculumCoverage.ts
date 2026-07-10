import { randomInt, type Rng } from '../../lib/rng';
import type { Problem } from '../../types/problem';
import type { TemplateGenerator } from './types';

const SUBJECT_ID = 'math';
const ELEMENTARY_GRADE_ID = 'g-elem6';
const JHS2_GRADE_ID = 'g-jhs2';

function hints(first: string, second: string, third: string): Problem['hints'] {
  return [first, second, third];
}

// 小6：文字を使って数量の関係を表す。
export const letterExpressionTemplate: TemplateGenerator = {
  key: 'letter-expression',
  subjectId: SUBJECT_ID,
  gradeId: ELEMENTARY_GRADE_ID,
  unitId: 'elem6-letter-expression',
  generate(rng?: Rng): Problem {
    const count = randomInt(2, 5, rng);
    const fee = randomInt(10, 50, rng) * 10;
    const choices = [`${count}x + ${fee}`, `${count + fee}x`, `x + ${fee * count}`];
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `えんぴつ1本を x 円とします。えんぴつを ${count} 本買い、送料 ${fee} 円を足すときの式を選ぼう。`,
      choices,
      answer: { format: 'choice', correctIndex: 0 },
      hints: hints(
        `えんぴつ ${count} 本の代金は、x を ${count} 回たすことだよ。`,
        `えんぴつ代は ${count}x、送料は ${fee} 円だよ。`,
        `品物の代金と送料をたす式は ${count}x + ${fee}。`,
      ),
      explanation: `${count} 本の代金は ${count}x 円で、送料 ${fee} 円を足すので ${count}x + ${fee}。`,
      difficulty: 2,
    };
  },
};

// 小6：縮図・拡大図では対応する長さを同じ倍率で考える。
export const scaleDrawingTemplate: TemplateGenerator = {
  key: 'scale-drawing',
  subjectId: SUBJECT_ID,
  gradeId: ELEMENTARY_GRADE_ID,
  unitId: 'elem6-scale-drawing',
  generate(rng?: Rng): Problem {
    const original = randomInt(2, 9, rng);
    const scale = randomInt(2, 5, rng);
    const answer = original * scale;
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `長さ ${original}cm の辺を ${scale} 倍に拡大しました。拡大図の辺の長さは？`,
      answer: { format: 'number', value: answer },
      hints: hints(
        '拡大図では、対応する長さを同じ倍率にするよ。',
        `${original} を ${scale} 倍しよう。`,
        `${original} × ${scale} は？`,
      ),
      explanation: `${original} × ${scale} = ${answer}。拡大図の辺の長さは ${answer}cm。`,
      difficulty: 2,
    };
  },
};

// 小6：線対称な図形の性質を、正多角形の対称の軸の本数で確かめる。
export const symmetryTemplate: TemplateGenerator = {
  key: 'symmetry',
  subjectId: SUBJECT_ID,
  gradeId: ELEMENTARY_GRADE_ID,
  unitId: 'elem6-symmetry',
  generate(rng?: Rng): Problem {
    const sides = randomInt(3, 8, rng);
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `正${sides}角形には、線対称の軸が何本ありますか？`,
      answer: { format: 'number', value: sides },
      hints: hints(
        '正多角形は、中心を通って重なる線を考えるよ。',
        '頂点を通る軸や辺の真ん中を通る軸を順に数えよう。',
        `正${sides}角形では、辺（頂点）の数と同じ本数あるよ。`,
      ),
      explanation: `正${sides}角形には、重なり合う線対称の軸が ${sides} 本あるよ。`,
      difficulty: 2,
    };
  },
};

// 小6：身の回りの形を長方形とみなして、およその面積を求める。
export const approximateAreaTemplate: TemplateGenerator = {
  key: 'approximate-area',
  subjectId: SUBJECT_ID,
  gradeId: ELEMENTARY_GRADE_ID,
  unitId: 'elem6-approximate-area',
  generate(rng?: Rng): Problem {
    const width = randomInt(8, 20, rng);
    const height = randomInt(5, 15, rng);
    const answer = width * height;
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `曲がった形の花だんを、たて ${height}m・横 ${width}m の長方形とみなします。およその面積は？`,
      answer: { format: 'number', value: answer },
      hints: hints(
        'およその面積は、近い基本図形とみなして求めるよ。',
        '長方形の面積は、たて × 横。',
        `${height} × ${width} を計算しよう。`,
      ),
      explanation: `${height} × ${width} = ${answer}。およその面積は ${answer}m²。`,
      difficulty: 2,
    };
  },
};

// 小6：角柱と円柱の体積を、底面積×高さで求める。
export const solidVolumeTemplate: TemplateGenerator = {
  key: 'solid-volume',
  subjectId: SUBJECT_ID,
  gradeId: ELEMENTARY_GRADE_ID,
  unitId: 'elem6-solid-volume',
  generate(rng?: Rng): Problem {
    const baseArea = randomInt(4, 20, rng);
    const height = randomInt(2, 10, rng);
    const answer = baseArea * height;
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `底面積が ${baseArea}cm²、高さが ${height}cm の角柱の体積は？`,
      answer: { format: 'number', value: answer },
      hints: hints(
        '角柱や円柱の体積は、底面積 × 高さで求めるよ。',
        `底面積 ${baseArea}cm² に高さ ${height}cm をかけよう。`,
        `${baseArea} × ${height} は？`,
      ),
      explanation: `${baseArea} × ${height} = ${answer}。体積は ${answer}cm³。`,
      difficulty: 2,
    };
  },
};

// 小6：比例と反比例を、表に入る数を求める形で扱う。
export const proportionalInverseTemplate: TemplateGenerator = {
  key: 'proportional-inverse',
  subjectId: SUBJECT_ID,
  gradeId: ELEMENTARY_GRADE_ID,
  unitId: 'elem6-proportional-inverse',
  generate(rng?: Rng): Problem {
    const inverse = randomInt(0, 1, rng) === 1;
    const x = randomInt(2, 6, rng);
    const factor = randomInt(2, 6, rng);
    const answer = inverse ? factor : x * factor;
    const prompt = inverse
      ? `x と y は反比例し、x × y = ${x * factor} です。x = ${x} のとき、y は？`
      : `y は x に比例し、x = 1 のとき y = ${factor} です。x = ${x} のとき、y は？`;
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt,
      answer: { format: 'number', value: answer },
      hints: inverse
        ? hints(
            '反比例では x × y がいつも同じになるよ。',
            `${x} × y = ${x * factor} として考えよう。`,
            `${x * factor} ÷ ${x} は？`,
          )
        : hints(
            '比例では、x が何倍になると y も同じ倍率になるよ。',
            `x = 1 のとき y = ${factor} だから、1あたり ${factor}。`,
            `${x} × ${factor} は？`,
          ),
      explanation: inverse
        ? `${x * factor} ÷ ${x} = ${answer}。`
        : `${x} × ${factor} = ${answer}。`,
      difficulty: 3,
    };
  },
};

// 小6：代表値と度数分布の基礎として平均を求める。
export const elementaryDataTemplate: TemplateGenerator = {
  key: 'elementary-data',
  subjectId: SUBJECT_ID,
  gradeId: ELEMENTARY_GRADE_ID,
  unitId: 'elem6-data',
  generate(rng?: Rng): Problem {
    const center = randomInt(10, 30, rng);
    const values = [center - 2, center - 1, center, center + 1, center + 2];
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `次の5人の記録の平均は？ ${values.join('、')}`,
      answer: { format: 'number', value: center },
      hints: hints(
        '平均は、全部を足して人数でわるよ。',
        `合計は ${values.reduce((sum, value) => sum + value, 0)}、人数は5人。`,
        `合計を5でわろう。`,
      ),
      explanation: `合計を5人で分けると ${center}。平均は ${center}。`,
      difficulty: 2,
    };
  },
};

// 小6：場合の数を、落ちや重なりなく数える前段階として組合せを求める。
export const casesTemplate: TemplateGenerator = {
  key: 'cases',
  subjectId: SUBJECT_ID,
  gradeId: ELEMENTARY_GRADE_ID,
  unitId: 'elem6-cases',
  generate(rng?: Rng): Problem {
    const tops = randomInt(2, 5, rng);
    const bottoms = randomInt(2, 4, rng);
    const answer = tops * bottoms;
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `上着が ${tops} 着、ズボンが ${bottoms} 着あります。上着とズボンを1着ずつ選ぶ組合せは何通り？`,
      answer: { format: 'number', value: answer },
      hints: hints(
        '上着1着ごとに、ズボンを全部選べるよ。',
        `上着 ${tops} 着それぞれに、ズボン ${bottoms} 着の組合せがあるよ。`,
        `${tops} × ${bottoms} は？`,
      ),
      explanation: `${tops} × ${bottoms} = ${answer}。${answer}通り。`,
      difficulty: 2,
    };
  },
};

// 中2：平行線・角・多角形の性質を、内角の和から求める。
export const planeGeometryTemplate: TemplateGenerator = {
  key: 'plane-geometry',
  subjectId: SUBJECT_ID,
  gradeId: JHS2_GRADE_ID,
  unitId: 'jhs2-plane-geometry',
  generate(rng?: Rng): Problem {
    const sides = randomInt(3, 8, rng);
    const answer = 180 * (sides - 2);
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `${sides}角形の内角の和は何度？`,
      answer: { format: 'number', value: answer },
      hints: hints(
        '多角形は、1つの頂点から三角形に分けて考えるよ。',
        `${sides}角形は ${sides - 2} 個の三角形に分けられるよ。`,
        `180 × ${sides - 2} を計算しよう。`,
      ),
      explanation: `180 × (${sides} - 2) = ${answer}。`,
      difficulty: 2,
    };
  },
};

// 中2：合同条件と証明で使う根拠を選ぶ。
export const congruenceProofTemplate: TemplateGenerator = {
  key: 'congruence-proof',
  subjectId: SUBJECT_ID,
  gradeId: JHS2_GRADE_ID,
  unitId: 'jhs2-congruence-proof',
  generate(): Problem {
    const choices = [
      '3組の辺がそれぞれ等しい',
      '2組の辺とその間の角がそれぞれ等しい',
      '1組の辺だけが等しい',
    ];
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: '2つの三角形で、対応する3組の辺がそれぞれ等しいとき、合同を示す根拠はどれ？',
      choices,
      answer: { format: 'choice', correctIndex: 0 },
      hints: hints(
        '合同条件は、三角形がぴったり重なるための条件だよ。',
        '辺が3組とも等しいことに注目しよう。',
        '3組の辺がそれぞれ等しいことは、三角形の合同条件の1つ。',
      ),
      explanation: '対応する3組の辺がそれぞれ等しいので、2つの三角形は合同といえる。',
      difficulty: 2,
    };
  },
};

// 中2：四分位範囲と箱ひげ図の基礎として、四分位範囲を求める。
export const boxPlotTemplate: TemplateGenerator = {
  key: 'box-plot',
  subjectId: SUBJECT_ID,
  gradeId: JHS2_GRADE_ID,
  unitId: 'jhs2-box-plot',
  generate(rng?: Rng): Problem {
    const firstQuartile = randomInt(10, 30, rng);
    const thirdQuartile = firstQuartile + randomInt(4, 12, rng);
    const answer = thirdQuartile - firstQuartile;
    return {
      source: 'template',
      subjectId: this.subjectId,
      gradeId: this.gradeId,
      unitId: this.unitId,
      prompt: `第1四分位数が ${firstQuartile}、第3四分位数が ${thirdQuartile} のとき、四分位範囲は？`,
      answer: { format: 'number', value: answer },
      hints: hints(
        '四分位範囲は、データの真ん中半分の広がりを表すよ。',
        '第3四分位数から第1四分位数をひくよ。',
        `${thirdQuartile} - ${firstQuartile} は？`,
      ),
      explanation: `${thirdQuartile} - ${firstQuartile} = ${answer}。四分位範囲は ${answer}。`,
      difficulty: 2,
    };
  },
};
