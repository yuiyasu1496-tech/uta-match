import { songs } from "@/data/songs";

export type DifficultyKey =
  | "highestNote"
  | "lowestNote"
  | "falsettoHighestNote"
  | "falsettoLowestNote"
  | "voiceSwitch"
  | "highNoteFrequency"
  | "highNoteLongTone"
  | "breath"
  | "fastLyrics"
  | "pitchMovement"
  | "rhythm";

export type Singability = 1 | 2 | 3 | 4 | 5;

export type SongRating = {
  songId: string;
  keyChange: string;
  singability: Singability;
  difficultPoints: DifficultyKey[];
};

export type AbilityResult = {
  key: DifficultyKey;
  label: string;
  score: number;
  confidence: number;
  description: string;
};

export type DiagnosisType = {
  id: string;
  emoji: string;
  name: string;
  catchphrase: string;
  description: string;
};

export type DiagnosisResult = {
  type: DiagnosisType;
  abilities: AbilityResult[];
  averageScore: number;
  averageConfidence: number;
  ratedSongCount: number;
};

type Evidence = {
  score: number;
  weight: number;
};

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

const abilityMeta: Record<
  DifficultyKey,
  {
    label: string;
    description: string;
  }
> = {
  highestNote: {
    label: "地声高音",
    description: "高い地声を無理なく使える力",
  },
  lowestNote: {
    label: "地声低音",
    description: "低い地声を安定して使える力",
  },
  falsettoHighestNote: {
    label: "裏声高音",
    description: "高い裏声を安定して使える力",
  },
  falsettoLowestNote: {
    label: "裏声低音",
    description: "低い裏声を安定して使える力",
  },
  voiceSwitch: {
    label: "地声↔裏声",
    description: "地声と裏声をスムーズに切り替える力",
  },
  highNoteFrequency: {
    label: "高音連発",
    description: "地声高音が続く曲への対応力",
  },
  highNoteLongTone: {
    label: "高音ロング",
    description: "高い地声を長く維持する力",
  },
  breath: {
    label: "ブレス",
    description: "息の長いフレーズへの対応力",
  },
  fastLyrics: {
    label: "滑舌",
    description: "速い歌詞や言葉数の多い曲への対応力",
  },
  pitchMovement: {
    label: "音程変化",
    description: "細かい音程変化や跳躍への対応力",
  },
  rhythm: {
    label: "リズム",
    description: "複雑なリズムへの対応力",
  },
};

const allAbilityKeys: DifficultyKey[] = [
  "highestNote",
  "lowestNote",
  "falsettoHighestNote",
  "falsettoLowestNote",
  "voiceSwitch",
  "highNoteFrequency",
  "highNoteLongTone",
  "breath",
  "fastLyrics",
  "pitchMovement",
  "rhythm",
];

const technicalKeys: DifficultyKey[] = [
  "voiceSwitch",
  "highNoteFrequency",
  "highNoteLongTone",
  "breath",
  "fastLyrics",
  "pitchMovement",
  "rhythm",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
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

function shiftNote(
  note: string | null,
  semitones: number,
) {
  if (!note) {
    return null;
  }

  const index = noteOrder.indexOf(note);

  if (index === -1) {
    return note;
  }

  const shiftedIndex = clamp(
    index + semitones,
    0,
    noteOrder.length - 1,
  );

  return noteOrder[shiftedIndex];
}

function getNoteIndex(note: string | null) {
  if (!note) {
    return null;
  }

  const index = noteOrder.indexOf(note);

  return index === -1 ? null : index;
}

function singabilityBaseScore(
  singability: Singability,
) {
  switch (singability) {
    case 1:
      return 1.2;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 4.8;
  }
}

function technicalEvidence(
  load: number,
  rating: SongRating,
  key: DifficultyKey,
): Evidence {
  const difficult =
    rating.difficultPoints.includes(key);

  const overall = singabilityBaseScore(
    rating.singability,
  );

  const loadFactor = (load - 3) * 0.55;

  let score =
    overall +
    loadFactor * ((rating.singability - 3) / 2);

  if (difficult) {
    score -= 1.15;
  } else if (
    load >= 4 &&
    rating.singability >= 4
  ) {
    score += 0.35;
  }

  score = clamp(score, 1, 5);

  let weight = 1;

  weight += Math.abs(load - 3) * 0.2;

  if (difficult) {
    weight += 0.45;
  }

  if (
    rating.singability === 1 ||
    rating.singability === 5
  ) {
    weight += 0.25;
  }

  return {
    score,
    weight,
  };
}

function highRangeEvidence(
  note: string | null,
  rating: SongRating,
  key:
    | "highestNote"
    | "falsettoHighestNote",
): Evidence | null {
  const index = getNoteIndex(note);

  if (index === null) {
    return null;
  }

  const difficult =
    rating.difficultPoints.includes(key);

  const referenceIndex =
    noteOrder.indexOf("mid2F");

  const noteScore =
    3 + (index - referenceIndex) * 0.16;

  const overallAdjustment =
    (rating.singability - 3) * 0.55;

  const difficultAdjustment = difficult
    ? -0.8
    : 0;

  const score = clamp(
    noteScore +
      overallAdjustment +
      difficultAdjustment,
    1,
    5,
  );

  let weight = 1.2;

  if (difficult) {
    weight += 0.5;
  }

  if (rating.singability >= 4) {
    weight += 0.25;
  }

  if (rating.keyChange === "わからない") {
    weight *= 0.65;
  }

  return {
    score,
    weight,
  };
}

function lowRangeEvidence(
  note: string | null,
  rating: SongRating,
  key:
    | "lowestNote"
    | "falsettoLowestNote",
): Evidence | null {
  const index = getNoteIndex(note);

  if (index === null) {
    return null;
  }

  const difficult =
    rating.difficultPoints.includes(key);

  const referenceIndex =
    noteOrder.indexOf("mid1F");

  const noteScore =
    3 + (referenceIndex - index) * 0.16;

  const overallAdjustment =
    (rating.singability - 3) * 0.55;

  const difficultAdjustment = difficult
    ? -0.8
    : 0;

  const score = clamp(
    noteScore +
      overallAdjustment +
      difficultAdjustment,
    1,
    5,
  );

  let weight = 1.2;

  if (difficult) {
    weight += 0.5;
  }

  if (rating.singability >= 4) {
    weight += 0.25;
  }

  if (rating.keyChange === "わからない") {
    weight *= 0.65;
  }

  return {
    score,
    weight,
  };
}

function weightedAverage(
  evidence: Evidence[],
) {
  if (evidence.length === 0) {
    return 3;
  }

  const totalWeight = evidence.reduce(
    (sum, item) => sum + item.weight,
    0,
  );

  const weightedTotal = evidence.reduce(
    (sum, item) =>
      sum + item.score * item.weight,
    0,
  );

  return weightedTotal / totalWeight;
}

function calculateConfidence(
  evidence: Evidence[],
) {
  if (evidence.length === 0) {
    return 10;
  }

  const totalWeight = evidence.reduce(
    (sum, item) => sum + item.weight,
    0,
  );

  const confidence =
    18 +
    evidence.length * 9 +
    totalWeight * 5;

  return Math.round(
    clamp(confidence, 10, 92),
  );
}

function getScore(
  abilities: AbilityResult[],
  key: DifficultyKey,
) {
  return (
    abilities.find(
      (ability) => ability.key === key,
    )?.score ?? 3
  );
}

function determineType(
  abilities: AbilityResult[],
): DiagnosisType {
  const highVoice = getScore(
    abilities,
    "highestNote",
  );

  const lowVoice = getScore(
    abilities,
    "lowestNote",
  );

  const falsetto =
    (getScore(
      abilities,
      "falsettoHighestNote",
    ) +
      getScore(
        abilities,
        "falsettoLowestNote",
      )) /
    2;

  const voiceSwitch = getScore(
    abilities,
    "voiceSwitch",
  );

  const highEndurance =
    (getScore(
      abilities,
      "highNoteFrequency",
    ) +
      getScore(
        abilities,
        "highNoteLongTone",
      )) /
    2;

  const breath = getScore(
    abilities,
    "breath",
  );

  const technical =
    (getScore(
      abilities,
      "fastLyrics",
    ) +
      getScore(
        abilities,
        "pitchMovement",
      ) +
      getScore(
        abilities,
        "rhythm",
      )) /
    3;

  const allAverage =
    abilities.reduce(
      (sum, ability) =>
        sum + ability.score,
      0,
    ) / abilities.length;

  const spread =
    Math.max(
      ...abilities.map(
        (ability) => ability.score,
      ),
    ) -
    Math.min(
      ...abilities.map(
        (ability) => ability.score,
      ),
    );

  if (
    allAverage >= 3.8 &&
    spread <= 1.6
  ) {
    return {
      id: "all-rounder",
      emoji: "⚖️",
      name: "オールラウンダー",
      catchphrase:
        "ジャンルを選ばない万能型",
      description:
        "歌唱能力のバランスがよく、特定の要素だけに大きく左右されにくいタイプ。幅広い曲を候補にしやすい傾向があります。",
    };
  }

  if (
    highVoice >= 4 &&
    highVoice >= highEndurance + 0.5
  ) {
    return {
      id: "high-tone",
      emoji: "🚀",
      name: "ハイトーンスター",
      catchphrase:
        "高音そのものが武器になるタイプ",
      description:
        "高い地声への対応力が強み。高音が一発登場する曲では力を発揮しやすく、高音の連発やロングトーンとの相性が選曲のポイントになります。",
    };
  }

  if (highEndurance >= 4) {
    return {
      id: "high-endurance",
      emoji: "🔥",
      name: "ハイトーンランナー",
      catchphrase:
        "高音が続いても崩れにくい持久型",
      description:
        "地声高音の連発やロングトーンへの対応力が強み。サビで高音が続く曲でもパフォーマンスを維持しやすいタイプです。",
    };
  }

  if (
    falsetto >= 4 &&
    voiceSwitch >= 3.5
  ) {
    return {
      id: "falsetto",
      emoji: "🪽",
      name: "ファルセットマスター",
      catchphrase:
        "裏声を自在に使う軽やかタイプ",
      description:
        "裏声域と地声・裏声の切り替えへの対応力が強み。声区を行き来する曲や、ファルセットを活かす楽曲との相性が良くなりやすいタイプです。",
    };
  }

  if (lowVoice >= 4) {
    return {
      id: "low-tone",
      emoji: "🌙",
      name: "ロートーン職人",
      catchphrase:
        "低音域で魅力を出しやすいタイプ",
      description:
        "低い地声への対応力が強み。無理に高音を追わず、中低音を活かした選曲で歌いやすさを感じやすいタイプです。",
    };
  }

  if (breath >= 4) {
    return {
      id: "breath",
      emoji: "🫁",
      name: "ロングブレス型",
      catchphrase:
        "長いフレーズを安定して運ぶタイプ",
      description:
        "息の長さを要求されるフレーズへの対応力が強み。ブレスの少ない曲や、伸びやかなメロディで力を発揮しやすいタイプです。",
    };
  }

  if (
    technical >= 4 ||
    voiceSwitch >= 4.3
  ) {
    return {
      id: "technical",
      emoji: "⚡",
      name: "テクニカルシンガー",
      catchphrase:
        "細かい動きに強い技巧派タイプ",
      description:
        "滑舌・音程変化・リズム・声区の切り替えなど、音域だけでは測れない技術への対応力が強みのタイプです。",
    };
  }

  return {
    id: "developing",
    emoji: "🎯",
    name: "ピンポイント型",
    catchphrase:
      "得意条件がハマると強いタイプ",
    description:
      "曲によって歌いやすさが変わりやすいタイプ。あなたの得意な音域と苦手要素を避けることで、相性のいい曲を見つけやすくなります。",
  };
}

export function calculateDiagnosis(
  ratings: SongRating[],
): DiagnosisResult {
  const evidenceMap: Record<
    DifficultyKey,
    Evidence[]
  > = {
    highestNote: [],
    lowestNote: [],
    falsettoHighestNote: [],
    falsettoLowestNote: [],
    voiceSwitch: [],
    highNoteFrequency: [],
    highNoteLongTone: [],
    breath: [],
    fastLyrics: [],
    pitchMovement: [],
    rhythm: [],
  };

  ratings.forEach((rating) => {
    const song = songs.find(
      (item) =>
        item.id === rating.songId,
    );

    if (!song) {
      return;
    }

    const shift = getKeyShift(
      rating.keyChange,
    );

    const shiftedHighest = shiftNote(
      song.highestNote,
      shift,
    );

    const shiftedLowest = shiftNote(
      song.lowestNote,
      shift,
    );

    const shiftedFalsettoHighest =
      shiftNote(
        song.falsettoHighestNote,
        shift,
      );

    const shiftedFalsettoLowest =
      shiftNote(
        song.falsettoLowestNote,
        shift,
      );

    const highestEvidence =
      highRangeEvidence(
        shiftedHighest,
        rating,
        "highestNote",
      );

    if (highestEvidence) {
      evidenceMap.highestNote.push(
        highestEvidence,
      );
    }

    const lowestEvidence =
      lowRangeEvidence(
        shiftedLowest,
        rating,
        "lowestNote",
      );

    if (lowestEvidence) {
      evidenceMap.lowestNote.push(
        lowestEvidence,
      );
    }

    const falsettoHighestEvidence =
      highRangeEvidence(
        shiftedFalsettoHighest,
        rating,
        "falsettoHighestNote",
      );

    if (falsettoHighestEvidence) {
      evidenceMap.falsettoHighestNote.push(
        falsettoHighestEvidence,
      );
    }

    const falsettoLowestEvidence =
      lowRangeEvidence(
        shiftedFalsettoLowest,
        rating,
        "falsettoLowestNote",
      );

    if (falsettoLowestEvidence) {
      evidenceMap.falsettoLowestNote.push(
        falsettoLowestEvidence,
      );
    }

    technicalKeys.forEach((key) => {
      /*
       * 裏声を使用しない曲では、
       * 地声↔裏声切り替え能力の証拠として扱わない。
       */
      if (
        key === "voiceSwitch" &&
        song.falsettoHighestNote === null
      ) {
        return;
      }

      const load = song[key];

      const evidence =
        technicalEvidence(
          load,
          rating,
          key,
        );

      evidenceMap[key].push(evidence);
    });
  });

  const abilities =
    allAbilityKeys.map((key) => {
      const evidence =
        evidenceMap[key];

      return {
        key,
        label:
          abilityMeta[key].label,
        score: round1(
          weightedAverage(evidence),
        ),
        confidence:
          calculateConfidence(
            evidence,
          ),
        description:
          abilityMeta[key].description,
      };
    });

  const averageScore = round1(
    abilities.reduce(
      (sum, ability) =>
        sum + ability.score,
      0,
    ) / abilities.length,
  );

  const averageConfidence =
    Math.round(
      abilities.reduce(
        (sum, ability) =>
          sum + ability.confidence,
        0,
      ) / abilities.length,
    );

  return {
    type: determineType(abilities),
    abilities,
    averageScore,
    averageConfidence,
    ratedSongCount: ratings.length,
  };
}