// This was taken from https://github.com/lamyiowce/word2viz
export const analogyOptions = [
  {
    name: 'Gender analogies',
    words: [
      ['man', 'woman'],
      ['uncle', 'aunt'],
      ['niece', 'nephew'],
      ['king', 'queen'],
      ['brother', 'sister'],
      ['heir', 'heiress'],
      ['actor', 'actress'],
      ['son', 'daughter'],
      ['father', 'mother'],
      ['grandfather', 'grandmother']
    ],
    xAxis: ['he', 'she'],
    yAxis: ['queen', 'woman']
  },
  {
    name: 'Adjectives analogies',
    words: [
      ['clear', 'clearer', 'clearest'],
      ['dark', 'darker', 'darkest'],
      ['strong', 'stronger', 'strongest'],
      ['long', 'longer', 'longest'],
      ['big', 'bigger', 'biggest'],
      ['fat', 'fatter', 'fattest'],
      ['thin', 'thinner', 'thinnest']
    ],
    xAxis: ['nicest', 'nice'],
    yAxis: ['nicest', 'nicer']
  },
  {
    name: 'Numbers say-write analogies',
    words: [
      ['two', '2'],
      ['three', '3'],
      ['four', '4'],
      ['five', '5'],
      ['six', '6'],
      ['seven', '7']
    ],
    xAxis: ['3', 'three'],
    yAxis: ['seven', 'three']
  },
  {
    name: 'Up-down linguistic metaphors',
    words: [
      ['happy', 'sad'],
      ['rich', 'poor'],
      ['important', 'unimportant'],
      ['evil'],
      ['healthy', 'ill'],
      ['high', 'low'],
      ['conscious', 'unconscious'],
      ['unknown', 'known'],
      ['finished', 'incomplete', 'complete'],
      ['positive', 'negative'],
      ['active', 'passive'],
      ['hot', 'cold'],
      ['loud', 'quiet'],
      ['on', 'off']
    ],
    xAxis: ['good', 'bad'],
    yAxis: ['up', 'down']
  },
  {
    name: 'Verb tenses',
    words: [
      ['go', 'went'],
      ['swim', 'swam'],
      ['sing', 'sang'],
      ['dance', 'danced'],
      ['bring', 'brought'],
      ['break', 'broke'],
      ['destroy', 'destroyed'],
      ['play', 'played'],
      ['paint', 'painted'],
      ['look', 'looked'],
      ['fail', 'failed'],
      ['fight', 'fought'],
      ['betray', 'betrayed'],
      ['cheat', 'cheated']
    ],
    yAxis: ['she', 'he'],
    xAxis: ['gave', 'give']
  },
  {
    name: 'Jobs',
    words: [
      ['nurse'],
      ['doctor'],
      ['waiter', 'waitress'],
      ['actor', 'actress'],
      ['teacher'],
      ['ceo'],
      ['secretary'],
      ['plumber'],
      ['nanny'],
      ['programmer'],
      ['homemaker'],
      ['painter'],
      ['dancer'],
      ['singer'],
      ['prostitute'],
      ['thief'],
      ['businessman', 'businesswoman'],
      ['policeman', 'policewoman'],
      ['janitor'],
      ['priest'],
      ['nun']
    ],
    yAxis: ['rich', 'poor'],
    xAxis: ['she', 'he']
  },
  {
    name: 'Intelligence',
    words: [
      ['smart'],
      ['dumb'],
      ['idiot'],
      ['genius'],
      ['intelligent'],
      ['stupid'],
      ['clever']
    ],
    xAxis: ['fast', 'slow'],
    yAxis: ['bright', 'dim']
  },
  {
    name: 'Empty',
    words: [],
    xAxis: ['', ''],
    yAxis: ['', '']
  }
]
