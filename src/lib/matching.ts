import { songs, type Song } from "@/data/songs";
import {
  calculateDiagnosis,
  type AbilityResult,
  type DifficultyKey,
  type SongRating,
} from "@/lib/diagnosis";

export type RangeProfile = {
  groundHighest: string | null;
  groundLowest: string | null;
  falsettoHighest: string | null;
  falsettoLowest: string | null;

  groundHighestConfidence: number;
  groundLowestConfidence: number;
  falsettoHighestConfidence: number;
  falsettoLowestConfidence: number;

  groundLowestBoundaryKnown: boolean;
  falsettoHighestBoundaryKnown: boolean;
  falsettoLowestBoundaryKnown: boolean;
};

export type MatchReason = {
  type: "good" | "warning" | "bad";
  text: string;
};

export type SongMatch = {
  song: Song;
  matchScore: number;
  recommendedKey: number;
  confidence: number;
  reasons: MatchReason[];
};

type RangeObservation = {
  index: number;
  singability: number;
  difficult: boolean;
  weight: number;
};

type TechnicalDifficultyKey =
  | "voiceSwitch"
  | "highNoteFrequency"
  | "highNoteLongTone"
  | "breath"
  | "fastLyrics"
  | "pitchMovement"
  | "rhythm";

const noteOrder = [
  "lowC",
  "lowC#",
  "lowD",
  "lowD#",
  "lowE",
  "lowF",
  "lowF#",
  "lowG",
  "lowG#",

  "mid1A",
  "mid1A#",
  "mid1B",
  "mid1C",
  "mid1C#",
  "mid1D",
  "mid1D#",
  "mid1E",
  "mid1F",
  "mid1F#",
  "mid1G",
  "mid1G#",

  "mid2A",
  "mid2A#",
  "mid2B",
  "mid2C",
  "mid2C#",
  "mid2D",
  "mid2D#",
  "mid2E",
  "mid2F",
  "mid2F#",
  "mid2G",
  "mid2G#",

  "hiA",
  "hiA#",
  "hiB",
  "hiC",
  "hiC#",
  "hiD",
  "hiD#",
  "hiE",
  "hiF",
  "hiF#",
  "hiG",
  "hiG#",

  "hihiA",
  "hihiA#",
  "hihiB",
  "hihiC",
];

const technicalKeys: TechnicalDifficultyKey[] = [
  "voiceSwitch",
  "highNoteFrequency",
  "highNoteLongTone",
  "breath",
  "fastLyrics",
  "pitchMovement",
  "rhythm",
];

const technicalLabels: Record<
  TechnicalDifficultyKey,
  string
> = {
  voiceSwitch: "地声↔裏声の切り替え",
  highNoteFrequency: "地声高音の連発",
  highNoteLongTone: "高音ロングトーン",
  breath: "ブレス",
  fastLyrics: "滑舌",
  pitchMovement: "音程変化",
  rhythm: "リズム",
};

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(Math.max(value, min), max);
}

function noteIndex(note: string | null) {
  if (!note) {
    return null;
  }

  const index = noteOrder.indexOf(note);

  return index === -1 ? null : index;
}

function noteFromIndex(index: number | null) {
  if (index === null) {
    return null;
  }

  const safeIndex = clamp(
    Math.round(index),
    0,
    noteOrder.length - 1,
  );

  return noteOrder[safeIndex];
}

function shiftNote(
  note: string | null,
  semitones: number,
) {
  const index = noteIndex(note);

  if (index === null) {
    return null;
  }

  return noteFromIndex(index + semitones);
}

function getKeyShift(keyChange: string) {
  if (
    keyChange === "原キー" ||
    keyChange === "わからない"
  ) {
    return 0;
  }

  const parsed = Number(keyChange);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function weightedAverageIndex(
  observations: RangeObservation[],
) {
  if (observations.length === 0) {
    return null;
  }

  const totalWeight = observations.reduce(
    (sum, item) => sum + item.weight,
    0,
  );

  if (totalWeight === 0) {
    return null;
  }

  const total = observations.reduce(
    (sum, item) =>
      sum + item.index * item.weight,
    0,
  );

  return total / totalWeight;
}

function observationWeight(rating: SongRating) {
  let weight = 1;

  if (
    rating.singability === 1 ||
    rating.singability === 5
  ) {
    weight += 0.4;
  }

  if (rating.keyChange === "わからない") {
    weight *= 0.6;
  }

  return weight;
}

function comfortableHighIndex(
  observations: RangeObservation[],
) {
  if (observations.length === 0) {
    return null;
  }

  const adjusted = observations.map(
    (observation) => {
      let offset = 0;

      if (observation.singability === 5) {
        offset += 1;
      }

      if (observation.singability === 4) {
        offset += 0;
      }

      if (observation.singability === 3) {
        offset -= 1;
      }

      if (observation.singability === 2) {
        offset -= 2;
      }

      if (observation.singability === 1) {
        offset -= 3;
      }

      if (observation.difficult) {
        offset -= 1;
      }

      return {
        ...observation,
        index: observation.index + offset,
      };
    },
  );

  return weightedAverageIndex(adjusted);
}

function comfortableLowIndex(
  observations: RangeObservation[],
) {
  if (observations.length === 0) {
    return null;
  }

  const adjusted = observations.map(
    (observation) => {
      let offset = 0;

      if (observation.singability === 5) {
        offset -= 1;
      }

      if (observation.singability === 4) {
        offset += 0;
      }

      if (observation.singability === 3) {
        offset += 1;
      }

      if (observation.singability === 2) {
        offset += 2;
      }

      if (observation.singability === 1) {
        offset += 3;
      }

      if (observation.difficult) {
        offset += 1;
      }

      return {
        ...observation,
        index: observation.index + offset,
      };
    },
  );

  return weightedAverageIndex(adjusted);
}

function rangeConfidence(
  observations: RangeObservation[],
) {
  if (observations.length === 0) {
    return 10;
  }

  const knownKeyCount = observations.filter(
    (item) => item.weight >= 1,
  ).length;

  return Math.round(
    clamp(
      20 +
        observations.length * 11 +
        knownKeyCount * 5,
      10,
      92,
    ),
  );
}

export function inferRangeProfile(
  ratings: SongRating[],
): RangeProfile {
  const groundHigh: RangeObservation[] = [];
  const groundLow: RangeObservation[] = [];
  const falsettoHigh: RangeObservation[] = [];
  const falsettoLow: RangeObservation[] = [];

  let groundLowestBoundaryKnown = false;
  let falsettoHighestBoundaryKnown = false;
  let falsettoLowestBoundaryKnown = false;

  ratings.forEach((rating) => {
    const song = songs.find(
      (item) => item.id === rating.songId,
    );

    if (!song) {
      return;
    }

    const shift = getKeyShift(rating.keyChange);
    const weight = observationWeight(rating);

    const shiftedGroundHigh = noteIndex(
      shiftNote(song.highestNote, shift),
    );

    const shiftedGroundLow = noteIndex(
      shiftNote(song.lowestNote, shift),
    );

    const shiftedFalsettoHigh = noteIndex(
      shiftNote(
        song.falsettoHighestNote,
        shift,
      ),
    );

    const shiftedFalsettoLow = noteIndex(
      shiftNote(
        song.falsettoLowestNote,
        shift,
      ),
    );

    if (shiftedGroundHigh !== null) {
      groundHigh.push({
        index: shiftedGroundHigh,
        singability: rating.singability,
        difficult:
          rating.difficultPoints.includes(
            "highestNote",
          ),
        weight,
      });
    }

    if (shiftedGroundLow !== null) {
      const difficult =
        rating.difficultPoints.includes(
          "lowestNote",
        );

      if (difficult) {
        groundLowestBoundaryKnown = true;
      }

      groundLow.push({
        index: shiftedGroundLow,
        singability: rating.singability,
        difficult,
        weight,
      });
    }

    if (shiftedFalsettoHigh !== null) {
      const difficult =
        rating.difficultPoints.includes(
          "falsettoHighestNote",
        );

      if (difficult) {
        falsettoHighestBoundaryKnown = true;
      }

      falsettoHigh.push({
        index: shiftedFalsettoHigh,
        singability: rating.singability,
        difficult,
        weight,
      });
    }

    if (shiftedFalsettoLow !== null) {
      const difficult =
        rating.difficultPoints.includes(
          "falsettoLowestNote",
        );

      if (difficult) {
        falsettoLowestBoundaryKnown = true;
      }

      falsettoLow.push({
        index: shiftedFalsettoLow,
        singability: rating.singability,
        difficult,
        weight,
      });
    }
  });

  return {
    groundHighest: noteFromIndex(
      comfortableHighIndex(groundHigh),
    ),

    /*
     * 低音・裏声音域は、
     * 「その音まで歌った」だけでは
     * 限界とは判断しない。
     *
     * ユーザーが実際に難しいと回答した場合のみ、
     * マッチング用の境界として採用する。
     */
    groundLowest: groundLowestBoundaryKnown
      ? noteFromIndex(
          comfortableLowIndex(groundLow),
        )
      : null,

    falsettoHighest: falsettoHighestBoundaryKnown
      ? noteFromIndex(
          comfortableHighIndex(falsettoHigh),
        )
      : null,

    falsettoLowest: falsettoLowestBoundaryKnown
      ? noteFromIndex(
          comfortableLowIndex(falsettoLow),
        )
      : null,

    groundHighestConfidence:
      rangeConfidence(groundHigh),

    groundLowestConfidence:
      groundLowestBoundaryKnown
        ? rangeConfidence(groundLow)
        : 0,

    falsettoHighestConfidence:
      falsettoHighestBoundaryKnown
        ? rangeConfidence(falsettoHigh)
        : 0,

    falsettoLowestConfidence:
      falsettoLowestBoundaryKnown
        ? rangeConfidence(falsettoLow)
        : 0,

    groundLowestBoundaryKnown,
    falsettoHighestBoundaryKnown,
    falsettoLowestBoundaryKnown,
  };
}

function getAbility(
  abilities: AbilityResult[],
  key: DifficultyKey,
) {
  return (
    abilities.find(
      (ability) => ability.key === key,
    ) ?? null
  );
}

function rangePenaltyHigh(
  songNote: string | null,
  userLimit: string | null,
) {
  const songIndex = noteIndex(songNote);
  const userIndex = noteIndex(userLimit);

  if (
    songIndex === null ||
    userIndex === null
  ) {
    return {
      penalty: 0,
      difference: 0,
      evaluable: false,
    };
  }

  const difference = songIndex - userIndex;

  if (difference <= 0) {
    return {
      penalty: 0,
      difference,
      evaluable: true,
    };
  }

  if (difference === 1) {
    return {
      penalty: 5,
      difference,
      evaluable: true,
    };
  }

  if (difference === 2) {
    return {
      penalty: 11,
      difference,
      evaluable: true,
    };
  }

  if (difference === 3) {
    return {
      penalty: 19,
      difference,
      evaluable: true,
    };
  }

  return {
    penalty: Math.min(
      36,
      19 + (difference - 3) * 5,
    ),
    difference,
    evaluable: true,
  };
}

function rangePenaltyLow(
  songNote: string | null,
  userLimit: string | null,
) {
  const songIndex = noteIndex(songNote);
  const userIndex = noteIndex(userLimit);

  if (
    songIndex === null ||
    userIndex === null
  ) {
    return {
      penalty: 0,
      difference: 0,
      evaluable: false,
    };
  }

  const difference = userIndex - songIndex;

  if (difference <= 0) {
    return {
      penalty: 0,
      difference,
      evaluable: true,
    };
  }

  if (difference === 1) {
    return {
      penalty: 3,
      difference,
      evaluable: true,
    };
  }

  if (difference === 2) {
    return {
      penalty: 7,
      difference,
      evaluable: true,
    };
  }

  if (difference === 3) {
    return {
      penalty: 12,
      difference,
      evaluable: true,
    };
  }

  return {
    penalty: Math.min(
      24,
      12 + (difference - 3) * 4,
    ),
    difference,
    evaluable: true,
  };
}

function technicalPenalty(
  load: number,
  abilityScore: number,
) {
  const gap = load - abilityScore;

  if (gap <= 0) {
    return {
      penalty: 0,
      gap,
    };
  }

  if (gap <= 0.5) {
    return {
      penalty: 1.5,
      gap,
    };
  }

  if (gap <= 1) {
    return {
      penalty: 3.5,
      gap,
    };
  }

  if (gap <= 2) {
    return {
      penalty: 7,
      gap,
    };
  }

  return {
    penalty: 11,
    gap,
  };
}

function formatKey(key: number) {
  if (key === 0) {
    return "原キー";
  }

  return key > 0 ? `+${key}` : `${key}`;
}

function evaluateSongAtKey(
  song: Song,
  keyShift: number,
  rangeProfile: RangeProfile,
  abilities: AbilityResult[],
) {
  let penalty = 0;

  const reasons: MatchReason[] = [];

  const groundHigh = shiftNote(
    song.highestNote,
    keyShift,
  );

  const groundLow = shiftNote(
    song.lowestNote,
    keyShift,
  );

  const falsettoHigh = shiftNote(
    song.falsettoHighestNote,
    keyShift,
  );

  const falsettoLow = shiftNote(
    song.falsettoLowestNote,
    keyShift,
  );

  /*
   * 地声最高音は通常どおり評価する。
   */
  const groundHighResult =
    rangePenaltyHigh(
      groundHigh,
      rangeProfile.groundHighest,
    );

  /*
   * 地声最低音・裏声最高音・裏声最低音は
   * 診断時に実際に「難しい」と回答した場合のみ
   * 境界として評価される。
   *
   * 境界が分からない場合は userLimit が null なので
   * penalty は発生しない。
   */
  const groundLowResult =
    rangePenaltyLow(
      groundLow,
      rangeProfile.groundLowest,
    );

  const falsettoHighResult =
    rangePenaltyHigh(
      falsettoHigh,
      rangeProfile.falsettoHighest,
    );

  const falsettoLowResult =
    rangePenaltyLow(
      falsettoLow,
      rangeProfile.falsettoLowest,
    );

  penalty += groundHighResult.penalty;
  penalty += groundLowResult.penalty;

  penalty +=
    falsettoHighResult.penalty * 0.7;

  penalty +=
    falsettoLowResult.penalty * 0.5;

  /*
   * 地声最高音については、
   * 推定できている限り理由として表示する。
   */
  if (groundHighResult.evaluable) {
    if (
      groundHighResult.difference <= 0
    ) {
      reasons.push({
        type: "good",
        text:
          "地声最高音があなたの推定快適音域に収まっています",
      });
    } else if (
      groundHighResult.difference <= 2
    ) {
      reasons.push({
        type: "warning",
        text:
          "地声最高音が推定快適域より少し高めです",
      });
    } else {
      reasons.push({
        type: "bad",
        text:
          "地声最高音が推定快適域を大きく超えています",
      });
    }
  }

  /*
   * 低音については、
   * 実際に低音を苦手ポイントとして選択した場合だけ
   * 警告を出す。
   */
  if (
    rangeProfile.groundLowestBoundaryKnown &&
    groundLowResult.evaluable
  ) {
    if (
      groundLowResult.difference >= 3
    ) {
      reasons.push({
        type: "bad",
        text:
          "このキーでは低音域の負荷が高くなりそうです",
      });
    } else if (
      groundLowResult.difference > 0
    ) {
      reasons.push({
        type: "warning",
        text:
          "最低音はあなたにはやや低めです",
      });
    }
  }

  /*
   * 裏声最高音も、
   * 「裏声高音が難しい」という回答が
   * 実際にあった場合のみ警告する。
   */
  if (
    rangeProfile.falsettoHighestBoundaryKnown &&
    falsettoHighResult.evaluable &&
    falsettoHighResult.difference > 0
  ) {
    reasons.push({
      type:
        falsettoHighResult.difference >= 3
          ? "bad"
          : "warning",
      text:
        "裏声最高音はあなたには負荷が高めです",
    });
  }

  /*
   * 裏声最低音も同様。
   */
  if (
    rangeProfile.falsettoLowestBoundaryKnown &&
    falsettoLowResult.evaluable &&
    falsettoLowResult.difference > 0
  ) {
    reasons.push({
      type:
        falsettoLowResult.difference >= 3
          ? "bad"
          : "warning",
      text:
        "裏声最低音はあなたにはやや低めです",
    });
  }

  const technicalResults: {
    key: TechnicalDifficultyKey;
    load: number;
    ability: number;
    penalty: number;
    gap: number;
  }[] = [];

  technicalKeys.forEach((key) => {
    if (
      key === "voiceSwitch" &&
      song.falsettoHighestNote === null
    ) {
      return;
    }

    const ability = getAbility(
      abilities,
      key,
    );

    if (!ability) {
      return;
    }

    const load = song[key];

    const result = technicalPenalty(
      load,
      ability.score,
    );

    technicalResults.push({
      key,
      load,
      ability: ability.score,
      penalty: result.penalty,
      gap: result.gap,
    });

    penalty += result.penalty;
  });

  const strongestTechnical = [
    ...technicalResults,
  ].sort(
    (a, b) =>
      b.penalty - a.penalty,
  );

  const biggestProblem =
    strongestTechnical.find(
      (item) => item.penalty >= 3.5,
    );

  if (biggestProblem) {
    reasons.push({
      type:
        biggestProblem.penalty >= 7
          ? "bad"
          : "warning",
      text: `${
        technicalLabels[
          biggestProblem.key
        ]
      }はあなたには負荷が高めです`,
    });
  }

  const strongPoints =
    technicalResults
      .filter(
        (item) =>
          item.load >= 3 &&
          item.gap <= -0.7,
      )
      .sort(
        (a, b) =>
          a.gap - b.gap,
      );

  if (strongPoints.length > 0) {
    reasons.push({
      type: "good",
      text: `${
        technicalLabels[
          strongPoints[0].key
        ]
      }には余裕がありそうです`,
    });
  }

  /*
   * 同程度の相性なら、
   * 極端なキー変更より原キーに近い方を優先。
   */
  penalty +=
    Math.abs(keyShift) * 0.35;

  /*
   * 強いボトルネックを追加で重視。
   */
  const largestTechnicalPenalty =
    technicalResults.length > 0
      ? Math.max(
          ...technicalResults.map(
            (item) => item.penalty,
          ),
        )
      : 0;

  if (
    groundHighResult.penalty >= 19
  ) {
    penalty += 7;
  }

  if (
    largestTechnicalPenalty >= 11
  ) {
    penalty += 4;
  }

  const matchScore = Math.round(
    clamp(
      100 - penalty,
      0,
      100,
    ),
  );

  /*
   * 表示理由は重要度順に並べたいので、
   * bad → warning → good の順にする。
   */
  const reasonPriority = {
    bad: 0,
    warning: 1,
    good: 2,
  };

  reasons.sort(
    (a, b) =>
      reasonPriority[a.type] -
      reasonPriority[b.type],
  );

  return {
    matchScore,
    reasons,
    keyShift,
  };
}

function calculateMatchConfidence(
  rangeProfile: RangeProfile,
  abilities: AbilityResult[],
) {
  /*
   * 「境界が分からない」項目を0%として
   * 平均に入れてしまうと、
   * 能力ではなく未観測であることだけで
   * 信頼度が不自然に下がる。
   *
   * そのため、実際に推定できている項目だけで
   * 信頼度を計算する。
   */
  const rangeConfidences = [
    rangeProfile.groundHighestConfidence,
    rangeProfile.groundLowestBoundaryKnown
      ? rangeProfile.groundLowestConfidence
      : null,
    rangeProfile.falsettoHighestBoundaryKnown
      ? rangeProfile.falsettoHighestConfidence
      : null,
    rangeProfile.falsettoLowestBoundaryKnown
      ? rangeProfile.falsettoLowestConfidence
      : null,
  ].filter(
    (value): value is number =>
      value !== null,
  );

  const abilityConfidences =
    abilities.map(
      (ability) =>
        ability.confidence,
    );

  const all = [
    ...rangeConfidences,
    ...abilityConfidences,
  ];

  if (all.length === 0) {
    return 0;
  }

  return Math.round(
    all.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / all.length,
  );
}

export function calculateSongMatches(
  ratings: SongRating[],
  includeKeyChanges: boolean,
): SongMatch[] {
  const diagnosis =
    calculateDiagnosis(ratings);

  const rangeProfile =
    inferRangeProfile(ratings);

  const candidateKeys =
    includeKeyChanges
      ? [
          0,
          -1,
          -2,
          -3,
          -4,
          -5,
          -6,
          1,
          2,
          3,
          4,
          5,
          6,
        ]
      : [0];

  const confidence =
    calculateMatchConfidence(
      rangeProfile,
      diagnosis.abilities,
    );

  return songs
    .map((song) => {
      const candidates =
        candidateKeys.map(
          (keyShift) =>
            evaluateSongAtKey(
              song,
              keyShift,
              rangeProfile,
              diagnosis.abilities,
            ),
        );

      const best = candidates.sort(
        (a, b) => {
          if (
            b.matchScore !==
            a.matchScore
          ) {
            return (
              b.matchScore -
              a.matchScore
            );
          }

          return (
            Math.abs(a.keyShift) -
            Math.abs(b.keyShift)
          );
        },
      )[0];

      return {
        song,
        matchScore: best.matchScore,
        recommendedKey:
          best.keyShift,
        confidence,
        reasons:
          best.reasons.slice(0, 3),
      };
    })
    .sort(
      (a, b) =>
        b.matchScore -
        a.matchScore,
    );
}

export function getRecommendedKeyLabel(
  key: number,
) {
  return formatKey(key);
}