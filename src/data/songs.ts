export type Song = {
  id: string;
  title: string;
  artist: string;

  releaseYear: number;
  genre: string;

  // 音域
  highestNote: string;
  lowestNote: string;
  falsettoHighestNote: string | null;
  falsettoLowestNote: string | null;

  // Uta-Match 歌唱分析（1〜5）
  // 数字が大きいほど、その要素による歌唱負荷が大きい
  voiceSwitch: number;
  highNoteFrequency: number;
  highNoteLongTone: number;
  breath: number;
  fastLyrics: number;
  pitchMovement: number;
  rhythm: number;

  // Uta-Match独自の総合難易度（1〜5）
  difficulty: number;

  analysis: string;
};

export const songs: Song[] = [
  {
    id: "lemon",
    title: "Lemon",
    artist: "米津玄師",

    releaseYear: 2018,
    genre: "J-POP",

    highestNote: "hiB",
    lowestNote: "mid1B",
    falsettoHighestNote: "hiB",
    falsettoLowestNote: "hiA#",

    voiceSwitch: 2,
    highNoteFrequency: 2,
    highNoteLongTone: 1,
    breath: 1,
    fastLyrics: 1,
    pitchMovement: 2,
    rhythm: 2,

    difficulty: 3,

    analysis:
      "AメロBメロは比較的歌いやすいが、サビでmid2F#~mid2G#の地声が登場。この高音部分と裏声のhiBがきれいに出せればこの曲はモノにできるだろう。（ラストサビで地声hiBが登場するが、ギリギリであれば裏声での歌唱で問題ない。）",
  },

  {
    id: "marigold",
    title: "マリーゴールド",
    artist: "あいみょん",

    releaseYear: 2018,
    genre: "J-POP",

    highestNote: "hiB",
    lowestNote: "mid1F#",
    falsettoHighestNote: "hiB",
    falsettoLowestNote: "hiB",

    voiceSwitch: 1,
    highNoteFrequency: 4,
    highNoteLongTone: 3,
    breath: 1,
    fastLyrics: 1,
    pitchMovement: 2,
    rhythm: 1,

    difficulty: 5,

    analysis:
      "サビでmid2G~hiAが多発。hiCなどの極端な高音はないが、地声高音部分に「i」の音が多いのも相まって想像以上に苦しい。裏声では違和感が生まれてしまう箇所も多いので、高音域が非常に得意な男性以外にはオススメしない。",
  },

  {
    id: "dry-flower",
    title: "ドライフラワー",
    artist: "優里",

    releaseYear: 2020,
    genre: "J-POP",

    highestNote: "hiA",
    lowestNote: "mid1G",
    falsettoHighestNote: "hiC",
    falsettoLowestNote: "mid2G",

    voiceSwitch: 2,
    highNoteFrequency: 3,
    highNoteLongTone: 2,
    breath: 1,
    fastLyrics: 1,
    pitchMovement: 1,
    rhythm: 2,

    difficulty: 4,

    analysis:
      "Bメロから音域が上がり、「i」の音で喉が詰まりやすい。不安であれば裏声で問題ないが、息量を抑えた響きのある裏声を用いることをオススメする。サビはさらに高いが、「o」「a」の母音が多いので比較的地声で出しやすいか。",
  },

  {
    id: "kaiju-no-hanauta",
    title: "怪獣の花唄",
    artist: "Vaundy",

    releaseYear: 2020,
    genre: "J-POP",

    highestNote: "hiB",
    lowestNote: "mid1D",
    falsettoHighestNote: "hiD",
    falsettoLowestNote: "hiA",

    voiceSwitch: 2,
    highNoteFrequency: 2,
    highNoteLongTone: 3,
    breath: 1,
    fastLyrics: 1,
    pitchMovement: 2,
    rhythm: 1,

    difficulty: 4,

    analysis:
      "BメロやCメロで地声のmid2F#~hiAが頻発し、少し苦しい。（Cメロに関してはオク下歌唱で問題ない。）サビのhiBは「ま」は裏声、「だ」を地声で発声すると楽だし違和感もないのでオススメ。",
  },

  {
    id: "chiisana-koi-no-uta",
    title: "小さな恋のうた",
    artist: "MONGOL800",

    releaseYear: 2001,
    genre: "J-POP",

    highestNote: "mid2G#",
    lowestNote: "mid1A#",
    falsettoHighestNote: null,
    falsettoLowestNote: null,

    voiceSwitch: 1,
    highNoteFrequency: 2,
    highNoteLongTone: 3,
    breath: 1,
    fastLyrics: 1,
    pitchMovement: 2,
    rhythm: 1,

    difficulty: 3,

    analysis: "",
  },

  {
    id: "ao-to-natsu",
    title: "青と夏",
    artist: "Mrs. GREEN APPLE",

    releaseYear: 2018,
    genre: "J-POP",

    highestNote: "hiC#",
    lowestNote: "mid1D#",
    falsettoHighestNote: "hiE",
    falsettoLowestNote: "mid2E",

    voiceSwitch: 2,
    highNoteFrequency: 5,
    highNoteLongTone: 3,
    breath: 3,
    fastLyrics: 2,
    pitchMovement: 4,
    rhythm: 2,

    difficulty: 5,

    analysis: "",
  },

  {
    id: "suiheisen",
    title: "水平線",
    artist: "back number",

    releaseYear: 2021,
    genre: "J-POP",

    highestNote: "mid2G",
    lowestNote: "mid1D",
    falsettoHighestNote: "hiC",
    falsettoLowestNote: "mid2F",

    voiceSwitch: 1,
    highNoteFrequency: 1,
    highNoteLongTone: 1,
    breath: 1,
    fastLyrics: 1,
    pitchMovement: 3,
    rhythm: 1,

    difficulty: 2,

    analysis: "",
  },

  {
    id: "hakujitsu",
    title: "白日",
    artist: "King Gnu",

    releaseYear: 2019,
    genre: "J-POP",

    highestNote: "hiB",
    lowestNote: "mid1A#",
    falsettoHighestNote: "hiF#",
    falsettoLowestNote: "mid2A",

    voiceSwitch: 5,
    highNoteFrequency: 2,
    highNoteLongTone: 2,
    breath: 5,
    fastLyrics: 3,
    pitchMovement: 5,
    rhythm: 5,

    difficulty: 5,

    analysis: "",
  },

  {
    id: "tomoni",
    title: "ともに",
    artist: "WANIMA",

    releaseYear: 2016,
    genre: "J-POP",

    highestNote: "hiC#",
    lowestNote: "mid1F",
    falsettoHighestNote: null,
    falsettoLowestNote: null,

    voiceSwitch: 1,
    highNoteFrequency: 5,
    highNoteLongTone: 2,
    breath: 5,
    fastLyrics: 4,
    pitchMovement: 4,
    rhythm: 3,

    difficulty: 5,

    analysis: "",
  },

  {
    id: "chankapana",
    title: "チャンカパーナ",
    artist: "NEWS",

    releaseYear: 2012,
    genre: "J-POP",

    highestNote: "hiA#",
    lowestNote: "mid1E",
    falsettoHighestNote: null,
    falsettoLowestNote: null,

    voiceSwitch: 1,
    highNoteFrequency: 3,
    highNoteLongTone: 5,
    breath: 3,
    fastLyrics: 2,
    pitchMovement: 3,
    rhythm: 1,

    difficulty: 4,

    analysis: "",
  },
];