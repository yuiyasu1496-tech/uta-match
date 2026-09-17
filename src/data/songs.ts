export type Song = {
  id: string;
  title: string;
  artist: string;

  releaseYear: number;
  genre: string;

  highestNote: string;
  lowestNote: string;
  falsettoHighestNote: string;

  stamina: number;
  breath: number;
  fastLyrics: number;
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

    stamina: 3,
    breath: 2,
    fastLyrics: 1,
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

    stamina: 5,
    breath: 3,
    fastLyrics: 2,
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

    stamina: 3,
    breath: 2,
    fastLyrics: 1,
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

    stamina: 4,
    breath: 3,
    fastLyrics: 2,
    difficulty: 4,

    analysis:
      "Bメロやラスサビ終わりに地声のmid2F#~hiAが頻発し、少し苦しい。（ラスサビ終わりに関してはオク下歌唱で問題ない。）サビのhiBは「ま」は裏声、「だ」を地声で発声すると楽だし違和感もないのでオススメ。",
  },
];