// src/data/songs.js - Full song data with lyrics, chords, strumming patterns

export const SONG_LIBRARY = [
  {
    id: 1,
    title: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    difficulty: "Beginner",
    chords: ["G", "D", "Am"],
    capo: null,
    bpm: 72,
    strummingPattern: ["D", "D", "U", "D", "U"],
    strummingName: "Folk Pattern",
    description: "Classic 3-chord song with a slow, easy tempo.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "Mama, take this badge off of me", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "I can't use it anymore", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 3 }] },
          { lyric: "It's gettin' dark, too dark to see", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "I feel I'm knockin' on heaven's door", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "Knock, knock, knockin' on heaven's door", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "Knock, knock, knockin' on heaven's door", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Knock, knock, knockin' on heaven's door", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "Knock, knock, knockin' on heaven's door", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "Mama, put my guns in the ground", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "I can't shoot them anymore", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 3 }] },
          { lyric: "That long black cloud is comin' down", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "I feel I'm knockin' on heaven's door", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "Knock, knock, knockin' on heaven's door", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "Knock, knock, knockin' on heaven's door", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Knock, knock, knockin' on heaven's door", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "Knock, knock, knockin' on heaven's door", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Horse With No Name",
    artist: "America",
    difficulty: "Beginner",
    chords: ["Em", "D"],
    capo: null,
    bpm: 80,
    strummingPattern: ["D", "U", "D", "U"],
    strummingName: "Down-Up",
    description: "Only 2 chords! Perfect for total beginners.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "On the first part of the journey", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "I was looking at all the life", chords: [{ chord: "D", position: 0 }] },
          { lyric: "There were plants and birds and rocks and things", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "There was sand and hills and rings", chords: [{ chord: "D", position: 0 }] },
          { lyric: "The first thing I met was a fly with a buzz", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "And the sky with no clouds", chords: [{ chord: "D", position: 0 }] },
          { lyric: "The heat was hot and the ground was dry", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "But the air was full of sound", chords: [{ chord: "D", position: 0 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "I've been through the desert on a horse with no name", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "It felt good to be out of the rain", chords: [{ chord: "D", position: 0 }] },
          { lyric: "In the desert you can remember your name", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "'Cause there ain't no one for to give you no pain", chords: [{ chord: "D", position: 0 }] },
          { lyric: "La la la la la la la la la la la", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "La la la la la la la", chords: [{ chord: "D", position: 0 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "After two days in the desert sun", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "My skin began to turn red", chords: [{ chord: "D", position: 0 }] },
          { lyric: "After three days in the desert fun", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "I was looking at a river bed", chords: [{ chord: "D", position: 0 }] },
          { lyric: "And the story it told of a river that flowed", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "Made me sad to think it was dead", chords: [{ chord: "D", position: 0 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "I've been through the desert on a horse with no name", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "It felt good to be out of the rain", chords: [{ chord: "D", position: 0 }] },
          { lyric: "In the desert you can remember your name", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "'Cause there ain't no one for to give you no pain", chords: [{ chord: "D", position: 0 }] },
          { lyric: "La la la la la la la la la la la", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "La la la la la la la", chords: [{ chord: "D", position: 0 }] },
        ]
      },
    ]
  },
  {
    id: 3,
    title: "Wonderwall",
    artist: "Oasis",
    difficulty: "Beginner",
    chords: ["Em", "G", "D", "A"],
    capo: 2,
    bpm: 87,
    strummingPattern: ["D", "D", "U", "U", "D", "U"],
    strummingName: "Pop Rhythm",
    description: "One of the most iconic beginner songs ever written.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "Today is gonna be the day", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "That they're gonna throw it back to you", chords: [{ chord: "D", position: 0 }, { chord: "A", position: 4 }] },
          { lyric: "By now you should've somehow", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Realized what you gotta do", chords: [{ chord: "D", position: 0 }, { chord: "A", position: 4 }] },
          { lyric: "I don't believe that anybody", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Feels the way I do about you now", chords: [{ chord: "D", position: 0 }, { chord: "A", position: 5 }] },
        ]
      },
      {
        section: "Pre-Chorus",
        lines: [
          { lyric: "Backbeat, the word is on the street", chords: [{ chord: "A", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "That the fire in your heart is out", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "I'm sure you've heard it all before", chords: [{ chord: "A", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "But you never really had a doubt", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "And all the roads we have to walk are winding", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "And all the lights that lead us there are blinding", chords: [{ chord: "A", position: 0 }, { chord: "Em", position: 4 }] },
          { lyric: "There are many things that I would like to say to you", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 6 }] },
          { lyric: "But I don't know how", chords: [{ chord: "A", position: 0 }] },
          { lyric: "Because maybe, you're gonna be the one that saves me", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 6 }] },
          { lyric: "And after all, you're my wonderwall", chords: [{ chord: "D", position: 0 }, { chord: "A", position: 5 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "Today was gonna be the day", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "But they'll never throw it back to you", chords: [{ chord: "D", position: 0 }, { chord: "A", position: 4 }] },
          { lyric: "By now you should've somehow", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Realized what you're not to do", chords: [{ chord: "D", position: 0 }, { chord: "A", position: 4 }] },
          { lyric: "I don't believe that anybody", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Feels the way I do about you now", chords: [{ chord: "D", position: 0 }, { chord: "A", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "And all the roads we have to walk are winding", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "And all the lights that lead us there are blinding", chords: [{ chord: "A", position: 0 }, { chord: "Em", position: 4 }] },
          { lyric: "There are many things that I would like to say to you", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 6 }] },
          { lyric: "But I don't know how", chords: [{ chord: "A", position: 0 }] },
          { lyric: "Because maybe, you're gonna be the one that saves me", chords: [{ chord: "Em", position: 0 }, { chord: "G", position: 6 }] },
          { lyric: "And after all, you're my wonderwall", chords: [{ chord: "D", position: 0 }, { chord: "A", position: 5 }] },
        ]
      },
    ]
  },
  {
    id: 4,
    title: "Stand By Me",
    artist: "Ben E. King",
    difficulty: "Beginner",
    chords: ["G", "Em", "C", "D"],
    capo: null,
    bpm: 120,
    strummingPattern: ["D", "D", "U", "D"],
    strummingName: "Folk Pattern",
    description: "Classic 4-chord pop progression.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "When the night has come and the land is dark", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "And the moon is the only light we'll see", chords: [{ chord: "Em", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "No I won't be afraid, no I won't be afraid", chords: [{ chord: "C", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "Just as long as you stand, stand by me", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "So darling, darling stand by me, oh stand by me", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 6 }] },
          { lyric: "Oh stand, stand by me, stand by me", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "If the sky that we look upon", chords: [{ chord: "D", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "If the sky that we look upon should tumble and fall", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 6 }] },
          { lyric: "Or the mountain should crumble to the sea", chords: [{ chord: "Em", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "I won't cry, I won't cry, no I won't shed a tear", chords: [{ chord: "C", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Just as long as you stand, stand by me", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "So darling, darling stand by me, oh stand by me", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 6 }] },
          { lyric: "Oh stand now, stand by me, stand by me", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 5 }] },
          { lyric: "Whenever you're in trouble won't you stand by me", chords: [{ chord: "D", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "Oh stand by me, stand by me", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
    ]
  },
  {
    id: 5,
    title: "Zombie",
    artist: "The Cranberries",
    difficulty: "Beginner",
    chords: ["Am", "C", "G", "Em"],
    capo: null,
    bpm: 95,
    strummingPattern: ["D", "D", "U", "U", "D", "U"],
    strummingName: "Pop Rhythm",
    description: "Powerful song with a simple repeating 4-chord loop.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "Another head hangs lowly", chords: [{ chord: "Am", position: 0 }] },
          { lyric: "Child is slowly taken", chords: [{ chord: "C", position: 0 }] },
          { lyric: "And the violence caused such silence", chords: [{ chord: "G", position: 0 }] },
          { lyric: "Who are we mistaken?", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "But you see, it's not me, it's not my family", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 5 }] },
          { lyric: "In your head, in your head, they are fighting", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "With their tanks and their bombs and their bombs and their guns", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 6 }] },
          { lyric: "In your head, in your head they are crying", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "In your head, in your head", chords: [{ chord: "Am", position: 0 }] },
          { lyric: "Zombie, zombie, zombie-ie-ie", chords: [{ chord: "C", position: 0 }] },
          { lyric: "What's in your head, in your head", chords: [{ chord: "G", position: 0 }] },
          { lyric: "Zombie, zombie, zombie-ie-ie", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "Oh, oh, oh, oh, oh, oh", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 3 }] },
          { lyric: "Oh oh oh oh", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 3 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "Another mother's breaking heart is taking over", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 5 }] },
          { lyric: "When the violence causes silence we must be mistaken", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 6 }] },
          { lyric: "It's the same old theme since nineteen-sixteen", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 5 }] },
          { lyric: "In your head, in your head they're still fighting", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "With their tanks and their bombs and their bombs and their guns", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 6 }] },
          { lyric: "In your head, in your head they are dying", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "In your head, in your head", chords: [{ chord: "Am", position: 0 }] },
          { lyric: "Zombie, zombie, zombie-ie-ie", chords: [{ chord: "C", position: 0 }] },
          { lyric: "What's in your head, in your head", chords: [{ chord: "G", position: 0 }] },
          { lyric: "Zombie, zombie, zombie-ie-ie", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "Oh, oh, oh, oh, oh, oh, oh", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "Oh oh oh oh oh", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 3 }] },
        ]
      },
    ]
  },
  {
    id: 6,
    title: "Hallelujah",
    artist: "Leonard Cohen",
    difficulty: "Beginner",
    chords: ["C", "Am", "G", "Em"],
    capo: null,
    bpm: 68,
    strummingPattern: ["D", "D", "U", "D"],
    strummingName: "Slow Ballad",
    description: "One of the most beautiful songs ever written.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "I've heard there was a secret chord", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "That David played and it pleased the Lord", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "But you don't really care for music, do you?", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "It goes like this, the fourth, the fifth", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 4 }] },
          { lyric: "The minor fall and the major lift", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "The baffled king composing Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "Hallelujah, Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Hallelujah, Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Hallelujah", chords: [{ chord: "G", position: 0 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "Your faith was strong but you needed proof", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "You saw her bathing on the roof", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Her beauty and the moonlight overthrew you", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "She tied you to a kitchen chair", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 4 }] },
          { lyric: "She broke your throne and she cut your hair", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "And from your lips she drew the Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "Hallelujah, Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Hallelujah, Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Hallelujah", chords: [{ chord: "G", position: 0 }] },
        ]
      },
      {
        section: "Verse 3",
        lines: [
          { lyric: "Maybe there's a God above", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "But all I've ever learned from love", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Was how to shoot somebody who outdrew you", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "It's not a cry that you hear at night", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 4 }] },
          { lyric: "It's not somebody who's seen the light", chords: [{ chord: "Am", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "It's a cold and it's a broken Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
      {
        section: "Final Chorus",
        lines: [
          { lyric: "Hallelujah, Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Hallelujah, Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Hallelujah, Hallelujah", chords: [{ chord: "C", position: 0 }, { chord: "Am", position: 4 }] },
          { lyric: "Hallelujah", chords: [{ chord: "G", position: 0 }] },
        ]
      },
    ]
  },
  {
    id: 7,
    title: "Take Me Home, Country Roads",
    artist: "John Denver",
    difficulty: "Beginner",
    chords: ["G", "Em", "D", "C"],
    capo: null,
    bpm: 120,
    strummingPattern: ["D", "D", "U", "U", "D", "U"],
    strummingName: "Pop Rhythm",
    description: "Beloved folk anthem everyone knows.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "Almost heaven, West Virginia", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Blue Ridge Mountains, Shenandoah River", chords: [{ chord: "Em", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "Life is old there, older than the trees", chords: [{ chord: "D", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "Younger than the mountains, blowing like a breeze", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "Country roads, take me home", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "To the place I belong", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "West Virginia, mountain mama", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Take me home, country roads", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "All my memories gather round her", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Miner's lady, stranger to blue water", chords: [{ chord: "Em", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "Dark and dusty, painted on the sky", chords: [{ chord: "D", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "Misty taste of moonshine, teardrop in my eye", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "Country roads, take me home", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "To the place I belong", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "West Virginia, mountain mama", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Take me home, country roads", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
      {
        section: "Bridge",
        lines: [
          { lyric: "I hear her voice in the morning hour she calls me", chords: [{ chord: "Em", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "The radio reminds me of my home far away", chords: [{ chord: "G", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "And driving down the road I get a feeling", chords: [{ chord: "Em", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "That I should have been home yesterday, yesterday", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
        ]
      },
      {
        section: "Final Chorus",
        lines: [
          { lyric: "Country roads, take me home", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 4 }] },
          { lyric: "To the place I belong", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "West Virginia, mountain mama", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Take me home, country roads", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "Take me home, down country roads", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 4 }] },
        ]
      },
    ]
  },
  {
    id: 8,
    title: "Let Her Go",
    artist: "Passenger",
    difficulty: "Beginner",
    chords: ["G", "D", "Em", "C"],
    capo: null,
    bpm: 100,
    strummingPattern: ["D", "D", "U", "U", "D", "U"],
    strummingName: "Pop Rhythm",
    description: "Modern acoustic classic.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "Well you only need the light when it's burning low", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Only miss the sun when it starts to snow", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "Only know you love her when you let her go", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Only know you've been high when you're feeling low", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "Only hate the road when you're missing home", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Only know you love her when you let her go", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 5 }] },
          { lyric: "And you let her go", chords: [{ chord: "G", position: 0 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "Staring at the bottom of your glass", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Hoping one day you'll make a dream last", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "But dreams come slow and they go so fast", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "You see her when you close your eyes", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "Maybe one day you'll understand why", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Everything you touch surely dies", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "But you only need the light when it's burning low", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Only miss the sun when it starts to snow", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "Only know you love her when you let her go", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Only know you've been high when you're feeling low", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "Only hate the road when you're missing home", chords: [{ chord: "G", position: 0 }, { chord: "D", position: 5 }] },
          { lyric: "Only know you love her when you let her go", chords: [{ chord: "Em", position: 0 }, { chord: "C", position: 5 }] },
        ]
      },
    ]
  },
  {
    id: 9,
    title: "Counting Stars",
    artist: "OneRepublic",
    difficulty: "Beginner",
    chords: ["Am", "C", "G", "Em"],
    capo: null,
    bpm: 122,
    strummingPattern: ["D", "D", "U", "U", "D", "U"],
    strummingName: "Pop Rhythm",
    description: "Hugely popular 4-chord loop.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "Lately I been, I been losing sleep", chords: [{ chord: "Am", position: 0 }] },
          { lyric: "Dreaming about the things that we could be", chords: [{ chord: "C", position: 0 }] },
          { lyric: "But baby I been, I been praying hard", chords: [{ chord: "G", position: 0 }] },
          { lyric: "Said no more counting dollars, we'll be counting stars", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "Yeah, we'll be counting stars", chords: [{ chord: "Am", position: 0 }] },
        ]
      },
      {
        section: "Pre-Chorus",
        lines: [
          { lyric: "I see this life like a swinging vine", chords: [{ chord: "Am", position: 0 }] },
          { lyric: "Swing my heart across the line", chords: [{ chord: "C", position: 0 }] },
          { lyric: "In my face is flashing signs", chords: [{ chord: "G", position: 0 }] },
          { lyric: "Seek it out and ye shall find", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "Old, but I'm not that old", chords: [{ chord: "Am", position: 0 }] },
          { lyric: "Young, but I'm not that bold", chords: [{ chord: "C", position: 0 }] },
          { lyric: "And I don't think the world is sold", chords: [{ chord: "G", position: 0 }] },
          { lyric: "I'm just doing what we're told", chords: [{ chord: "Em", position: 0 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "I feel something so right doing the wrong thing", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 5 }] },
          { lyric: "I feel something so wrong doing the right thing", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "I could lie, could lie, could lie", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 4 }] },
          { lyric: "Everything that drowns me makes me wanna fly", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 6 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "Lately I been, I been losing sleep", chords: [{ chord: "Am", position: 0 }] },
          { lyric: "Dreaming about the things that we could be", chords: [{ chord: "C", position: 0 }] },
          { lyric: "But baby I been, I been praying hard", chords: [{ chord: "G", position: 0 }] },
          { lyric: "Said no more counting dollars, we'll be counting stars", chords: [{ chord: "Em", position: 0 }] },
        ]
      },
      {
        section: "Final Chorus",
        lines: [
          { lyric: "Take that money, watch it burn", chords: [{ chord: "Am", position: 0 }] },
          { lyric: "Sink in the river the lessons I've learned", chords: [{ chord: "C", position: 0 }] },
          { lyric: "Take that money, watch it burn", chords: [{ chord: "G", position: 0 }] },
          { lyric: "Sink in the river the lessons I've learned", chords: [{ chord: "Em", position: 0 }] },
          { lyric: "Everything that kills me makes me feel alive", chords: [{ chord: "Am", position: 0 }, { chord: "C", position: 5 }] },
          { lyric: "Counting stars", chords: [{ chord: "G", position: 0 }, { chord: "Em", position: 3 }] },
        ]
      },
    ]
  },
  {
    id: 10,
    title: "Fast Car",
    artist: "Tracy Chapman",
    difficulty: "Beginner",
    chords: ["C", "G", "Am", "Em"],
    capo: null,
    bpm: 112,
    strummingPattern: ["D", "D", "U", "D", "U"],
    strummingName: "Folk Pattern",
    description: "Timeless acoustic classic.",
    sections: [
      {
        section: "Verse 1",
        lines: [
          { lyric: "You got a fast car, I want a ticket to anywhere", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "Maybe we make a deal, maybe together we can get somewhere", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "Any place is better, starting from zero got nothing to lose", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "Maybe we'll make something, me myself I got nothing to prove", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 5 }] },
        ]
      },
      {
        section: "Verse 2",
        lines: [
          { lyric: "You got a fast car, I got a plan to get us out of here", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "I been working at the convenience store", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 4 }] },
          { lyric: "Managed to save just a little bit of money", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "We won't have to drive too far, just 'cross the border and into the city", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 6 }] },
          { lyric: "You and I can both get jobs and finally see what it means to be living", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 6 }] },
        ]
      },
      {
        section: "Chorus",
        lines: [
          { lyric: "You got a fast car, but is it fast enough so we can fly away?", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 6 }] },
          { lyric: "We gotta make a decision, leave tonight or live and die this way", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 6 }] },
        ]
      },
      {
        section: "Verse 3",
        lines: [
          { lyric: "I remember we were driving, driving in your car", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "Speed so fast I felt like I was drunk", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 4 }] },
          { lyric: "City lights lay out before us", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 4 }] },
          { lyric: "And your arm felt nice wrapped 'round my shoulder", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 5 }] },
          { lyric: "And I had a feeling that I belonged", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 5 }] },
          { lyric: "I had a feeling I could be someone, be someone, be someone", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 6 }] },
        ]
      },
      {
        section: "Final Chorus",
        lines: [
          { lyric: "You got a fast car, but is it fast enough so we can fly away?", chords: [{ chord: "C", position: 0 }, { chord: "G", position: 6 }] },
          { lyric: "We gotta make a decision, leave tonight or live and die this way", chords: [{ chord: "Am", position: 0 }, { chord: "Em", position: 6 }] },
        ]
      },
    ]
  },
];
