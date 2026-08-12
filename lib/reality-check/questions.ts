import type { Question, QuestionOption, Section } from './types'

/**
 * Saara content Hinglish me hai: Hindi bol chaal, English alphabet me likhi
 * hui. Sawaalon ka matlab wahi hai jo pehle tha, sirf zubaan badli hai.
 */
export const DEFAULT_TIP =
  'Jo aam taur pe hota hai wahi likho, ek do exception ko chhod do.'

/** Lambe jawab wale sawaalon ke neeche dikhne wali line. */
const OPEN_HELPER = 'Sach sach likh do, do teen line kaafi hai.'

const YES_SOMETIMES_NO: QuestionOption[] = [
  { value: 'yes', label: 'Haan' },
  { value: 'sometimes', label: 'Kabhi kabhi' },
  { value: 'no', label: 'Nahi' },
]

/** 0 se 4 tak frequency. */
const FREQUENCY: QuestionOption[] = [
  { value: '0', label: 'Kabhi nahi' },
  { value: '1', label: 'Bahut kam' },
  { value: '2', label: 'Kabhi kabhi' },
  { value: '3', label: 'Aksar' },
  { value: '4', label: 'Bahut zyada' },
]

/** Hamesha se Kabhi nahi tak. */
const CONSISTENCY: QuestionOption[] = [
  { value: 'always', label: 'Hamesha' },
  { value: 'usually', label: 'Zyadatar' },
  { value: 'sometimes', label: 'Kabhi kabhi' },
  { value: 'rarely', label: 'Bahut kam' },
  { value: 'never', label: 'Kabhi nahi' },
]

export const SECTIONS: Section[] = [
  {
    id: 's1',
    index: 1,
    title: 'Sush ke saath kaisa lagta hai',
    description:
      'Nainu, ye soch ke batao ki Sush ke saath normally kaisa feel hota hai, sirf ek kharab din ka mat sochna.',
  },
  {
    id: 's2',
    index: 2,
    title: 'Ladai aur gussa',
    description: 'Jab dono ki ladai hoti hai, tab aam taur pe kya hota hai, wahi soch ke batao.',
  },
  {
    id: 's3',
    index: 3,
    title: 'Bharosa aur insecurity',
    description:
      'Ye bharose, jalan aur ek dusre ko khone ke dar ke baare me hai. Koi sahi ya galat jawab nahi hota.',
  },
  {
    id: 's4',
    index: 4,
    title: 'Ummeedein aur azaadi',
    description: 'Soch ke batao ki apne faisle khud le paati ho ya nahi.',
  },
  {
    id: 's5',
    index: 5,
    title: 'Baat cheet',
    description:
      'Jab tum bolti ho ki kuch bura laga, tab kya hota hai, aur tumhari raay ko kitni ahmiyat milti hai.',
  },
  {
    id: 's6',
    index: 6,
    title: 'Acchi baatein',
    description:
      'Sirf problems ki baat nahi hai. Sush jo accha karta hai wo bhi likhna, warna banda emotional ho jayega.',
  },
  {
    id: 's7',
    index: 7,
    title: 'Kadwa sach',
    description:
      'Nainu, ye thode uncomfortable ho sakte hain. Phir bhi sach likhna. Sach bol dene se koi buri nahi ban jaati.',
  },
  {
    id: 's8',
    index: 8,
    title: 'Sabse important sawaal',
    description:
      'Ye chand sawaal baaki sabse zyada matter karte hain. Inpe thoda time lena, jaldbaazi nahi.',
    emphasis: true,
  },
  {
    id: 's9',
    index: 9,
    title: 'Aakhri baat',
    description: 'Do score aur ek aakhri baat, apne hi shabdon me.',
  },
]

export const QUESTIONS: Question[] = [
  // ── Section 1 ────────────────────────────────────────────────────────────
  {
    id: 'q1',
    sectionId: 's1',
    displayNumber: '1',
    title: 'Sush ke saath hoti ho toh normally safe aur comfortable feel hota hai?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Safe ka matlab, tum sach bol sako, disagree kar sako, galti kar sako, ya jo feel ho wo keh sako, bina uske reaction ke dar ke.',
      example: 'Tum usse aisi baat bolti ho jo shayad usko pasand na aaye. Phir bhi bolne me comfortable lagti ho?',
    },
  },
  {
    id: 'q2',
    sectionId: 's1',
    displayNumber: '2',
    title: 'Uske saath apni asli wali Nainu ban paati ho?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Matlab tum normally baat kar sako, mazaak kar sako, jaisa mann ho waisa pehen sako, apni raay de sako, bina ye soche ki usko khush rakhne ke liye alag banna padega.',
      example:
        'Uske saath ho aur mann kar raha hai loud, quiet, bewakoof ya serious hone ka. Waisa hi behave karti ho ya thoda alag?',
    },
  },
  {
    id: 'q3',
    sectionId: 's1',
    displayNumber: '3',
    title: 'Usse baat karne se pehle sochna padta hai ki kya bolun?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye is baare me hai ki bolne se pehle tum apne shabd tolti ho ya nahi, aur kitni baar.',
      example:
        'Ek normal sa mazaak karna tha, par ruk gayi kyunki laga ki wo galat matlab nikaal lega.',
    },
  },
  {
    id: 'q4',
    sectionId: 's1',
    displayNumber: '4',
    title: 'Choti choti baatein baar baar samjhani padti hain taaki wo sahi samjhe?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye is baare me hai ki ek hi baat baar baar bolni padti hai taaki usko tumhara matlab samajh aaye.',
      example:
        'Tumne casually kuch bola. Usne kuch negative samajh liya. Ab tumhe explain karna pad raha hai ki asli me matlab kya tha.',
    },
  },
  {
    id: 'q5',
    sectionId: 's1',
    displayNumber: '5',
    title: 'Sush se pyaar mehsoos hota hai?',
    required: false,
    type: 'rating',
    rating: { min: 0, max: 10, minLabel: 'Bilkul nahi', maxLabel: 'Poori tarah' },
    info: {
      what: 'Ye tumhari apni feeling ki baat hai, wo kya bolta hai ya kya karta hai uski nahi. Jo number zyadatar dinon pe fit baithe wahi chuno.',
      example: '0 matlab bilkul pyaar feel nahi hota. 10 matlab poora poora feel hota hai.',
      tip: 'Aam dinon ka soch ke batao, ek bahut acche ya bahut kharab din ka nahi.',
    },
  },
  {
    id: 'q6',
    sectionId: 's1',
    displayNumber: '6',
    title: 'Baar baar ladai hone se thak jaati ho?',
    required: false,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye us thakan ki baat hai jo ladai baar baar hone se aati hai, kaam ya daily life ki thakan ki nahi.',
      example:
        'Wahi purani baat phir se shuru hoti hai aur shuru hone se pehle hi energy khatam lagti hai.',
    },
  },

  // ── Section 2 ────────────────────────────────────────────────────────────
  {
    id: 'q7',
    sectionId: 's2',
    displayNumber: '7',
    title: 'Jab Sush ko gussa aata hai, tab tumhe kya feel hota hai?',
    required: true,
    type: 'multi',
    options: [
      { value: 'angry', label: 'Gussa' },
      { value: 'sad', label: 'Dukh' },
      { value: 'scared', label: 'Dar' },
      { value: 'guilty', label: 'Guilty' },
      { value: 'confused', label: 'Confusion' },
      { value: 'tired', label: 'Thakan' },
      { value: 'frustrated', label: 'Frustration' },
      { value: 'nothing', label: 'Kuch khaas nahi' },
      { value: 'other', label: 'Kuch aur', isOther: true },
    ],
    info: {
      what: 'Yahan koi sahi feeling nahi hoti. Jo jo aam taur pe hota hai sab chun lo. Ek se zyada bhi chun sakti ho.',
      example: 'Uski awaaz tez ho jaati hai, ya wo chup ho jaata hai. Us waqt tumhare andar kya chalta hai?',
      tip: 'Jo aam taur pe feel hota hai wo chuno, sirf ek baar ka nahi.',
    },
  },
  {
    id: 'q8',
    sectionId: 's2',
    displayNumber: '8',
    title: 'Usse disagree karte waqt safe feel hota hai?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Ye is baare me hai ki tum apni alag raay khul ke bol paati ho ya nahi.',
      example:
        "Tumhari soch usse alag hai. Kya tum bol sakti ho, 'mujhe nahi lagta tum sahi ho', bina uske reaction se dare?",
    },
  },
  {
    id: 'q9',
    sectionId: 's2',
    displayNumber: '9',
    title: 'Kabhi koi baat isliye chhod deti ho kyunki lagta hai ladai ho jayegi?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye un topics ki baat hai jinhe tum chhed ti hi nahi, ki pata nahi phir kya ho jaye.',
      example: 'Mann me kuch chal raha hai. Tum decide karti ho ki aaj rehne do. Aisa kitni baar hota hai?',
    },
  },
  {
    id: 'q10',
    sectionId: 's2',
    displayNumber: '10',
    title: 'Ladai ke waqt lagta hai ki wo tumhari sun raha hai?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Sunna matlab wo sach me samajh raha hai ki tum kya keh rahi ho, sirf apni baari ka wait nahi kar raha.',
      example: 'Tum apni baat rakh rahi ho. Lagta hai ki wo tumhara point follow kar raha hai?',
    },
  },
  {
    id: 'q11',
    sectionId: 's2',
    displayNumber: '11',
    title: 'Tumhari baat poori hone se pehle hi wo decide kar leta hai ki tumhara matlab kya tha?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye is baare me hai ki tumhari baat khatam hone se pehle hi wo apna conclusion nikaal leta hai.',
      example: 'Tum explain karna shuru karti ho. Beech me hi wo aise jawab deta hai jaise sab pata ho.',
    },
  },
  {
    id: 'q12',
    sectionId: 's2',
    displayNumber: '12',
    title: 'Jab tum kuch explain karti ho, lagta hai ki wo tum pe yakeen karta hai?',
    required: true,
    type: 'scale',
    options: CONSISTENCY,
    info: {
      what: 'Yakeen karna matlab wo maan leta hai ki jo tumne bola wo sach hai, chahe wo abhi bhi upset ho.',
      example: 'Tum bata deti ho ki asli me kya hua tha. Uske baad baat khatam ho jaati hai, ya wahi sawaal phir aata hai?',
    },
  },
  {
    id: 'q13',
    sectionId: 's2',
    displayNumber: '13',
    title: "Kabhi mann me aaya hai, 'ab main thak gayi hoon isko phir se samjhate samjhate'?",
    required: false,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Ye us feeling ki baat hai jab wahi conversation dobara karne ki himmat hi nahi bachti.',
      example: 'Koi aisi baat aa jaati hai jo tum pehle explain kar chuki ho. Sabse pehle mann me kya aata hai?',
    },
  },
  {
    id: 'q14',
    sectionId: 's2',
    displayNumber: '14',
    title: 'Sush se ladte waqt sabse mushkil kya lagta hai?',
    required: false,
    type: 'text',
    placeholder: 'Mere liye sabse mushkil ye hai ki…',
    recommendedChars: 20,
    info: {
      what: 'Soch ke batao ki ladai me tumhe kya sabse zyada bhaari padta hai. Uska gussa, ek hi baat ghumana, bahut saare sawaal, apni baat na pahunch paana, purani baatein nikaalna, ya kuch aur.',
      example: 'Apne shabdon me likh do. Koi sahi jawab nahi hai.',
      tip: 'Do teen line bilkul kaafi hai.',
    },
  },
  {
    id: 'q15',
    sectionId: 's2',
    displayNumber: '15',
    title: 'Ladai ke baad aam taur pe kya hota hai?',
    required: true,
    type: 'single',
    options: [
      { value: 'talk_solve', label: 'Baat karke solve kar lete hain' },
      { value: 'calm_later', label: 'Thande hoke baad me baat karte hain' },
      { value: 'apology', label: 'Koi ek sorry bol deta hai' },
      { value: 'stop_talking', label: 'Kuch time baat band ho jaati hai' },
      { value: 'returns', label: 'Wahi baat baad me phir aa jaati hai' },
      { value: 'another_fight', label: 'Ek aur ladai ban jaati hai' },
      { value: 'unsolved', label: 'Sach me kuch solve hota hi nahi' },
      { value: 'other', label: 'Kuch aur', isOther: true },
    ],
    info: {
      what: 'Jo zyadatar ladaiyon ke baad hota hai wo chuno, ek alag se hui baar ka nahi.',
      example: 'Ladai khatam. Uske baad ke ghanton ya dinon me normally kya hota hai?',
    },
  },

  // ── Section 3 ────────────────────────────────────────────────────────────
  {
    id: 'q16',
    sectionId: 's3',
    displayNumber: '16',
    title: 'Tumhe kitna lagta hai ki Sush tum pe bharosa karta hai?',
    required: true,
    type: 'rating',
    rating: { min: 0, max: 10, minLabel: 'Bilkul nahi', maxLabel: 'Poora poora' },
    info: {
      what: 'Ye tumhara apna andaaza hai ki wo tum pe kitna bharosa karta hai. 0 matlab bilkul nahi, 10 matlab poora.',
      example: 'Soch ke dekho ki uske bina tum jo normal kaam karti ho, unpe uska reaction kaisa hota hai.',
    },
  },
  {
    id: 'q17',
    sectionId: 's3',
    displayNumber: '17',
    title: 'Usko kabhi dar lagta hai ki tum usko chhod ke kisi aur ke paas chali jaogi?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye us dar ki baat hai jo wo khud zubaan pe laata hai, ki kahin tum kisi aur ke saath na chali jao.',
      example: 'Soch ke batao ki ye baat conversation me aati hai ya nahi, aur kitni baar.',
    },
  },
  {
    id: 'q18',
    sectionId: 's3',
    displayNumber: '18',
    title: 'Kabhi usko lagta hai ki kuch galat hai, jabki tumne kuch galat kiya hi nahi?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye is baare me hai ki usko problem lagti hai, jabki tumhari taraf se kuch hua hi nahi hota.',
      example: 'Tum kisi se normally baat karti ho, par usko lagta hai ki koi aur wajah hogi.',
    },
  },
  {
    id: 'q19',
    sectionId: 's3',
    displayNumber: '19',
    title: 'Baar baar bolna padta hai ki tum usse pyaar karti ho aur chhod ke nahi jaogi?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Matlab usko dobara yakeen dilana ki tum usse pyaar karti ho, ya ki tum ja nahi rahi.',
      example: 'Soch ke batao ki uska mann shaant karne ke liye ye baat kitni baar bolni padti hai.',
    },
  },
  {
    id: 'q20',
    sectionId: 's3',
    displayNumber: '20',
    title: 'Ye bolne ke baad wo sirf thodi der ke liye theek hota hai?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Ye is baare me hai ki wo kitni der theek rehta hai, phir wahi wali tension wapas aa jaati hai.',
      example: 'Tum samjha deti ho aur mahaul shaant ho jaata hai. Wahi baat baad me phir aati hai, ya settle ho jaati hai?',
    },
  },
  {
    id: 'q21',
    sectionId: 's3',
    displayNumber: '21',
    title: 'Kabhi lagta hai ki tumhe apni loyalty saabit karni pad rahi hai?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye us feeling ki baat hai ki tumhe proof dena pad raha hai, seedhe seedhe yakeen nahi kiya ja raha.',
      example: 'Soch ke dekho ki shak mitane ke liye tum explanation, messages ya details deti ho ya nahi.',
    },
  },
  {
    id: 'q22',
    sectionId: 's3',
    displayNumber: '22',
    title: 'Uski tension ki wajah se tum apni normal cheezein badal deti ho?',
    required: false,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Ye is baare me hai ki uski fikron ki wajah se tumhare din ki normal cheezein badal jaati hain.',
      example: 'Koi bhi normal cheez soch lo jo tum ab alag tarike se karti ho, jo akele decide karti toh alag hota.',
    },
  },
  {
    id: 'q22a',
    sectionId: 's3',
    displayNumber: '22a',
    title: 'Ek example bata do?',
    required: false,
    type: 'text',
    placeholder: 'Jaise ki…',
    recommendedChars: 20,
    condition: { questionId: 'q22', anyOf: ['yes', 'sometimes'] },
    info: {
      what: 'Ek do line kaafi hai. Utna hi likho jitna likhne me comfortable ho.',
      example: 'Koi specific, roz wali situation zyada kaam ki hoti hai bajaye general baat ke.',
    },
  },
  {
    id: 'q23',
    sectionId: 's3',
    displayNumber: '23',
    title:
      'Kabhi lagta hai ki batana padta hai kisse baat ki, kahan gayi thi, ya kya kar rahi thi, jabki kuch galat hua hi nahi?',
    required: false,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye apne din ki normal cheezon ka hisaab dene ki baat hai.',
      example: 'Tum kisi normal jagah se wapas aati ho. Normally kya poocha jaata hai, aur tumhe kaisa lagta hai?',
    },
  },

  // ── Section 4 ────────────────────────────────────────────────────────────
  {
    id: 'q24',
    sectionId: 's4',
    displayNumber: '24',
    title: 'Is rishte me apne faisle khud le paati ho?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Azaadi matlab tum apni cheezein khud decide kar sako, choti choti roz wali cheezein bhi.',
      example: 'Tumhe apna koi plan banana hai. Khud decide kar leti ho, ya uske reaction pe depend karta hai?',
    },
  },
  {
    id: 'q25',
    sectionId: 's4',
    displayNumber: '25',
    title: 'Sush ummeed karta hai ki tum bilkul waise hi karo jaise wo chahta hai?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye is baare me hai ki wo ek hi exact tarika chahta hai cheezein karne ka.',
      example: 'Tum koi cheez apne tarike se karti ho. Uske baad normally kya hota hai?',
    },
  },
  {
    id: 'q26',
    sectionId: 's4',
    displayNumber: '26',
    title: 'Jab tum koi cheez uske soche hue tarike se alag karti ho, tab wo upset ho jaata hai?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Matlab tumne wo cheez waise nahi ki jaise usne socha tha, jabki kuch galat bhi nahi hua.',
      example: 'Tum koi roz wala kaam thode alag tarike se kar deti ho.',
    },
  },
  {
    id: 'q27',
    sectionId: 's4',
    displayNumber: '27',
    title: 'Wo ummeed karta hai ki bina bole hi tumhe pata ho ki usko kya chahiye?',
    required: false,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Matlab usne bola nahi, phir bhi tumhe uski marzi samajh leni chahiye.',
      example:
        "Wo ummeed karta hai ki tum kuch karo, kyunki uska sochna hai, 'agar sach me pyaar karti hai toh khud samajh jaati'.",
    },
  },
  {
    id: 'q28',
    sectionId: 's4',
    displayNumber: '28',
    title: 'Kabhi sirf isliye kuch karti ho taaki wo upset na ho?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Matlab wo kaam mann se nahi, balki isliye kiya ki wo naraz na ho jaye.',
      example: 'Tum kisi baat ke liye haan bol deti ho. Asli wajah kya thi, ye soch ke batao.',
    },
  },
  {
    id: 'q29',
    sectionId: 's4',
    displayNumber: '29',
    title: 'Tumhe lagta hai wo tumhe samajhna chahta hai, ya zyadatar tumhe badalna chahta hai?',
    required: false,
    type: 'single',
    options: [
      { value: 'understand', label: 'Zyadatar samajhna chahta hai' },
      { value: 'both', label: 'Dono' },
      { value: 'change', label: 'Zyadatar badalna chahta hai' },
      { value: 'unsure', label: 'Pata nahi' },
    ],
    info: {
      what: 'Ye poochh raha hai ki uski energy zyada kahan jaati hai, tumhara nazariya samajhne me ya tumhara behaviour badalne me.',
      example: 'Tum apni feeling batati ho. Uske baad conversation normally kis taraf jaati hai?',
    },
  },
  {
    id: 'q30',
    sectionId: 's4',
    displayNumber: '30',
    title: 'Kabhi is rishte me phasa hua ya control me feel hota hai?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Control hone ka matlab sirf ye nahi ki koi tumhe order de. Iska matlab ye bhi ho sakta hai ki tum normal faisle isliye nahi le paati kyunki partner ke reaction ki fikar rehti hai.',
      example: 'Koi roz wala faisla soch lo. Kya tum use dono taraf se khul ke le sakti ho?',
    },
  },
  {
    id: 'q31',
    sectionId: 's4',
    displayNumber: '31',
    title: 'Aisi ek cheez jo uske hisaab se pyaar hai, par tumhe control lagti hai?',
    required: false,
    type: 'text',
    placeholder: 'Ek cheez ye hai ki…',
    recommendedChars: 20,
    info: {
      what: 'Kuch cheezein pyaar se ki jaati hain, par saamne wale ko waisi feel nahi hoti. Ye us farq ki baat hai. Kuch yaad na aaye toh skip kar do.',
      example: 'Apne shabdon me likh do, jitna simple likhna hai likho.',
    },
  },

  // ── Section 5 ────────────────────────────────────────────────────────────
  {
    id: 'q32',
    sectionId: 's5',
    displayNumber: '32',
    title: 'Jab Sush tumhara dil dukhata hai, tum use bol paati ho?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: "Ye is baare me hai ki tum khul ke bol paati ho, 'mujhe ye bura laga'.",
      example: 'Uski koi baat dil me reh gayi. Tum usse bolti ho, ya apne andar rakh leti ho?',
    },
  },
  {
    id: 'q33',
    sectionId: 's5',
    displayNumber: '33',
    title: 'Jab tum bolti ho ki bura laga, tab wo pehle samajhne ki koshish karta hai?',
    required: true,
    type: 'scale',
    options: CONSISTENCY,
    info: {
      what: 'Pehle samajhna matlab wo apna side batane se pehle tumhari feeling ke baare me poochta hai.',
      example: 'Tum bolti ho ki bura laga. Sabse pehle normally kya hota hai?',
    },
  },
  {
    id: 'q34',
    sectionId: 's5',
    displayNumber: '34',
    title: 'Bura lagne pe wo pehle sunta hai, ya pehle ye samjhata hai ki bura lagna hi nahi chahiye tha?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye conversation ke order ki baat hai, samjhana pehle aur sunna baad me.',
      example: 'Tum bolti ho ki ye baat chubh gayi. Wo jawab me samjhane lagta hai ki chubhni nahi chahiye thi.',
    },
  },
  {
    id: 'q35',
    sectionId: 's5',
    displayNumber: '35',
    title: 'Disagree karne pe bhi wo tumhari raay ki izzat karta hai, chahe khud agree na ho?',
    required: false,
    type: 'scale',
    options: CONSISTENCY,
    info: {
      what: 'Izzat karna matlab tumhari raay ko sahi maana jaye, chahe wo usse agree na kare.',
      example: 'Tumhari soch alag hai. Conversation me tumhari raay ke saath kaisa behaviour hota hai?',
    },
  },
  {
    id: 'q36',
    sectionId: 's5',
    displayNumber: '36',
    title: 'Alag raay rakhne pe wo tumhe guilty feel karata hai?',
    required: false,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye is baare me hai ki alag sochna hi tumhari galti bana diya jaata hai.',
      example: 'Kisi normal cheez pe tumhari raay alag thi. Uske baad tumhe kaisa feel hota hai?',
    },
  },
  {
    id: 'q37',
    sectionId: 's5',
    displayNumber: '37',
    title: 'Aisi kya baat hai jo tum chahti ho ki wo tumhare baare me thoda behtar samjhe?',
    required: false,
    type: 'text',
    placeholder: 'Main chahti hoon ki wo samjhe ki…',
    recommendedChars: 20,
    info: {
      what: 'Kuch bhi ho sakta hai, tumhari soch, tumhari zarooratein, tumhara past, kaam, family, ya feelings.',
      example: 'Apne shabdon me likh do.',
    },
  },

  // ── Section 6 ────────────────────────────────────────────────────────────
  {
    id: 'q38',
    sectionId: 's6',
    displayNumber: '38',
    title: 'Sush aisa kya karta hai jisse tumhe sach me pyaara feel hota hai?',
    required: true,
    type: 'text',
    placeholder: 'Mujhe pyaar tab feel hota hai jab wo…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Wo cheezein socho jo sach me tumhe pyaar feel karati hain.',
      example: 'Choti aur simple cheez bhi chalegi. Choti cheezein bhi count hoti hain.',
    },
  },
  {
    id: 'q39',
    sectionId: 's6',
    displayNumber: '39',
    title: 'Sush ke saath rehne me tumhe sabse achhi cheez kya lagti hai?',
    required: false,
    type: 'text',
    placeholder: 'Sabse achhi cheez ye hai ki…',
    recommendedChars: 20,
    info: {
      what: 'Ye us baat ki hai jo saath rehne me tumhe pasand aati hai.',
      example: 'Koi feeling, koi aadat jo dono share karte ho, ya wo kaisa hai.',
    },
  },
  {
    id: 'q40',
    sectionId: 's6',
    displayNumber: '40',
    title: 'Kharab din ho toh lagta hai ki wo tumhara saath deta hai?',
    required: false,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Saath dena matlab wo aise react karta hai ki mushkil din me sach me halka lage.',
      example: 'Tumhara din bahut kharab gaya. Batane pe normally kya hota hai?',
    },
  },
  {
    id: 'q41',
    sectionId: 's6',
    displayNumber: '41',
    title: 'Lagta hai ki wo sach me tumhari khushi ki parwah karta hai?',
    required: false,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Ye is baare me hai ki uske kaam ye dikhate hain ki tumhari khushi matter karti hai, sirf baatein nahi.',
      example: 'Jab koi cheez tumhare liye bahut zaroori hoti hai, tab wo kaise react karta hai?',
    },
  },
  {
    id: 'q42',
    sectionId: 's6',
    displayNumber: '42',
    title: 'Uski aisi kya baat hai jo tum kabhi badalna nahi chahogi?',
    required: false,
    type: 'text',
    placeholder: 'Main kabhi nahi chahungi ki wo badle…',
    recommendedChars: 20,
    info: {
      what: 'Aisi cheez jo tum khona nahi chahogi.',
      example: 'Koi khoobi, koi aadat, ya jis tarah se wo tumse ya doosron se pesh aata hai.',
    },
  },

  // ── Section 7 ────────────────────────────────────────────────────────────
  {
    id: 'q43',
    sectionId: 's7',
    displayNumber: '43',
    title: 'Is rishte ka kaunsa hissa tumhe sabse zyada thaka deta hai?',
    required: true,
    type: 'text',
    placeholder: 'Sabse zyada thakane wali baat ye hai ki…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Thakan emotional bhi ho sakti hai, mental bhi, ya physical bhi. Koi galat jawab nahi hai.',
      example: 'Wo hissa likho jo tumse sabse zyada energy leta hai.',
    },
  },
  {
    id: 'q44',
    sectionId: 's7',
    displayNumber: '44',
    title: 'Sush aisa kya karta hai jo tumhe sabse zyada chubhta hai?',
    required: true,
    type: 'text',
    placeholder: 'Sabse zyada chubhta hai jab…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Yahan tum apna experience bata rahi ho. Ilzaam nahi laga rahi.',
      example: 'Ek do line kaafi hai.',
    },
  },
  {
    id: 'q45',
    sectionId: 's7',
    displayNumber: '45',
    title: 'Aisi kya baat hai jo tum usse bolne se darti ho, uske reaction ki wajah se?',
    required: true,
    type: 'text',
    placeholder: 'Maine usse ye nahi bataya ki…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Ye us baat ki hai jo tum apne andar rakh leti ho, kyunki lagta hai ki wo kaise react karega.',
      example: 'Agar kuch chhupati nahi ho toh wahi likh do. Wo bhi ek sahi jawab hai.',
    },
  },
  {
    id: 'q46',
    sectionId: 's7',
    displayNumber: '46',
    title: 'Tumhe kya lagta hai wo tumhare baare me kya nahi samajhta?',
    required: true,
    type: 'text',
    placeholder: 'Wo nahi samajhta ki main…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Tumhari koi aisi baat jo tumhe lagta hai usko samajh nahi aayi.',
      example: 'Ek specific cheez likho, sab kuch ek saath nahi.',
    },
  },
  {
    id: 'q47',
    sectionId: 's7',
    displayNumber: '47',
    title: 'Tumhe kya lagta hai wo apne baare me khud kya nahi samajhta?',
    required: true,
    type: 'text',
    placeholder: 'Mujhe lagta hai use khud nahi dikhta ki wo…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Ye tumhari apni honest raay hai. Tumhari raay hai, aur wo bilkul theek hai.',
      example: 'Jo tumne notice kiya wo apne shabdon me likh do.',
    },
  },
  {
    id: 'q48',
    sectionId: 's7',
    displayNumber: '48',
    title: 'Agar Sush ki EK aadat hamesha ke liye hata sakti, toh kaunsi hataati?',
    required: true,
    type: 'text',
    placeholder: 'Wo ek aadat ye hai…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Ek hi cheez, list nahi. Jo tumhare liye sabse zyada matter karti hai wahi chuno.',
      example: 'Wo cheez likho jo wo karta hai, uski wajah nahi jo tumhe lagti hai.',
    },
  },
  {
    id: 'q49',
    sectionId: 's7',
    displayNumber: '49',
    title: 'Usme sabse bada kya badalna chahti ho?',
    required: true,
    type: 'text',
    placeholder: 'Sabse bada change ye chahiye ki…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Wo ek change jisse tumhare liye sabse zyada farq padega.',
      example: 'Pichle jawab jaisa bhi ho sakta hai, ya bilkul alag bhi.',
    },
  },
  {
    id: 'q50',
    sectionId: 's7',
    displayNumber: '50',
    title: 'Lagta hai ki tum kuch bhi karo, usko koi na koi kami mil hi jaati hai?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Ye is baare me hai ki tumhare kiye hue kaam me aksar koi na koi problem nikal aati hai.',
      example: 'Tumne kuch kiya jo tumhe theek laga tha. Uske baad normally kya hota hai?',
    },
  },
  {
    id: 'q51',
    sectionId: 's7',
    displayNumber: '51',
    title: 'Lagta hai ki usko sahi saabit hona, tumhe samajhne se zyada zaroori hai?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Ye is baare me hai ki ladai me usko kya zyada matter karta hai, sahi hona ya tumhe samajhna.',
      example: 'Ladai khatam hoti hai. Soch ke dekho ki aakhir me baat kis cheez ki reh gayi thi.',
    },
  },

  // ── Section 8 ────────────────────────────────────────────────────────────
  {
    id: 'q52',
    sectionId: 's8',
    displayNumber: '52',
    title: 'Agar Sush agle 2 saal bilkul na badle, tab bhi ye rishta chahogi?',
    required: true,
    type: 'segmented',
    options: [
      { value: 'yes', label: 'Haan' },
      { value: 'unsure', label: 'Pata nahi' },
      { value: 'no', label: 'Nahi' },
    ],
    info: {
      what: 'Maan lo do saal tak kuch bhi nahi badla, na accha na bura. Usi hisaab se jawab do.',
      example: 'Na behtar, na kharab. Bilkul jaisa aaj hai waisa hi.',
      tip: "'Pata nahi' bolna bhi bilkul theek hai.",
    },
  },
  {
    id: 'q53',
    sectionId: 's8',
    displayNumber: '53',
    title: 'Abhi is rishte me khush ho?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Ye abhi ki baat hai, pehle kaisa tha ya aage kaisa hoga uski nahi.',
      example: 'Pichle kuch hafton ka soch ke batao.',
    },
  },
  {
    id: 'q54',
    sectionId: 's8',
    displayNumber: '54',
    title: 'Kya badalna chahiye taaki tum is rishte me zyada khush aur shaant feel karo?',
    required: true,
    type: 'text',
    placeholder: 'Mujhe sukoon tab milega jab…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Isme uski taraf ke change bhi ho sakte hain, tumhari taraf ke bhi, ya dono ke.',
      example: 'Apne shabdon me likh do.',
    },
  },
  {
    id: 'q55',
    sectionId: 's8',
    displayNumber: '55',
    title: 'Agar Sush ko EK bilkul sachhi baat bol sakti aur usko bura na lagta, toh kya bolti?',
    required: true,
    type: 'text',
    large: true,
    placeholder: 'Main ye bolti ki…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Aise likho jaise wo shaant reh kar sun lega aur maan lega. Yahan se kuch bhi usko bheja nahi ja raha.',
      example: 'Seedha seedha, apne shabdon me.',
      tip: 'Ye aksar poore questionnaire ka sabse kaam ka jawab hota hai. Ispe thoda time lena.',
    },
  },
  {
    id: 'q56',
    sectionId: 's8',
    displayNumber: '56',
    title: 'Zyada pyaar feel hota hai, ya zyada zimmedari ki usko khush rakhna hai?',
    required: true,
    type: 'single',
    options: [
      { value: 'loved', label: 'Zyada pyaar' },
      { value: 'both', label: 'Dono barabar' },
      { value: 'responsible', label: 'Zyada zimmedari uski khushi ki' },
      { value: 'unsure', label: 'Pata nahi' },
    ],
    info: {
      what: 'Dono ek saath bhi sach ho sakte hain. Jo zyada baar sach hota hai wahi chuno.',
      example: 'Soch ke dekho ki tumhari zyadatar energy kahan jaati hai.',
    },
  },
  {
    id: 'q57',
    sectionId: 's8',
    displayNumber: '57',
    title: 'Wo tum pe bharosa karta hai, ya tumhe baar baar apna pyaar saabit karna padta hai?',
    required: true,
    type: 'single',
    options: [
      { value: 'trusts', label: 'Bharosa karta hai' },
      { value: 'both', label: 'Dono' },
      { value: 'proving', label: 'Baar baar saabit karna padta hai' },
      { value: 'unsure', label: 'Pata nahi' },
    ],
    info: {
      what: 'Ye is baare me hai ki bharosa ek baar ban gaya, ya har baar naye sire se kamana padta hai.',
      example: 'Soch ke dekho ki bharose ki baat dono ke beech kitni baar aati hai.',
    },
  },
  {
    id: 'q58',
    sectionId: 's8',
    displayNumber: '58',
    title: 'Overall, is rishte ko kin shabdon me batao gi?',
    required: true,
    type: 'multi',
    maxSelections: 3,
    options: [
      { value: 'loved', label: 'Pyaari' },
      { value: 'safe', label: 'Safe' },
      { value: 'happy', label: 'Khush' },
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'understood', label: 'Samjhi hui' },
      { value: 'supported', label: 'Support wali' },
      { value: 'tired', label: 'Thaki hui' },
      { value: 'confused', label: 'Confused' },
      { value: 'restricted', label: 'Bandhi hui' },
      { value: 'anxious', label: 'Ghabrayi hui' },
      { value: 'frustrated', label: 'Frustrated' },
      { value: 'exhausted', label: 'Emotionally thaki hui' },
      { value: 'hopeful', label: 'Umeed wali' },
      { value: 'other', label: 'Kuch aur', isOther: true },
    ],
    info: {
      what: 'Teen tak shabd chuno jo poore rishte ko batate hain. Acche aur mushkil dono list me hain, mix bhi kar sakti ho.',
      example: 'Wo shabd chuno jo tab chunti agar koi aur padhne wala hi na hota.',
      tip: 'Jo aam taur pe sach hai wo chuno, sirf aaj ka nahi.',
    },
  },

  // ── Section 9 ────────────────────────────────────────────────────────────
  {
    id: 'q59',
    sectionId: 's9',
    displayNumber: '59',
    title: 'Is rishte ko 0 se 10 me kitna score dogi, abhi kaisa feel hota hai uske hisaab se?',
    required: true,
    type: 'rating',
    rating: {
      min: 0,
      max: 10,
      minLabel: 'Bahut mushkil',
      maxLabel: 'Bahut healthy aur khush',
    },
    info: {
      what: 'Ye score poore rishte ke liye hai, jaisa aaj tumhe feel hota hai.',
      example: '0 matlab bahut mushkil. 10 matlab bahut healthy aur khush.',
    },
  },
  {
    id: 'q60',
    sectionId: 's9',
    displayNumber: '60',
    title: 'Sush ko partner ke roop me 0 se 10 me kitna score dogi?',
    required: true,
    type: 'rating',
    rating: {
      min: 0,
      max: 10,
      minLabel: 'Mere liye bahut mushkil',
      maxLabel: 'Zabardast partner',
    },
    info: {
      what: 'Ye score uske partner wale behaviour ke liye hai. Ye poore rishte wale score se alag ho sakta hai.',
      example: '0 matlab tumhare liye bahut mushkil. 10 matlab zabardast partner.',
    },
  },
  {
    id: 'q61',
    sectionId: 's9',
    displayNumber: '61',
    title: 'Ye sab padhne ke baad Sush ko EK baat kya samajh aani chahiye?',
    required: true,
    type: 'text',
    large: true,
    placeholder: 'Main chahti hoon wo ye samjhe ki…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Sirf ek baat. Agar wo tumhare saare jawab padh le, toh kaunsi ek baat uske dimaag me reh jani chahiye?',
      example: 'Questionnaire ki aakhri line samajh ke likh do.',
    },
  },
]

/** Ek section ke saare sawaal, order me. */
export function questionsForSection(sectionId: string): Question[] {
  return QUESTIONS.filter((q) => q.sectionId === sectionId)
}

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id)
}

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id)
}

/** Store kiye hue value ka padhne layak label. */
export function labelForValue(question: Question, value: string): string {
  return question.options?.find((o) => o.value === value)?.label ?? value
}
