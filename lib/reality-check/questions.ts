import type { Question, QuestionOption, Section } from './types'

/**
 * Shared tip, per the info-sheet spec. Individual questions can override it.
 */
export const DEFAULT_TIP = 'Answer about what usually happens, not about one unusual time.'

/** Guidance shown under required open-text answers. */
const OPEN_HELPER = 'Please give an honest answer. A few sentences are enough.'

const YES_SOMETIMES_NO: QuestionOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'no', label: 'No' },
]

/** 0–4 frequency scale. */
const FREQUENCY: QuestionOption[] = [
  { value: '0', label: 'Never' },
  { value: '1', label: 'Rarely' },
  { value: '2', label: 'Sometimes' },
  { value: '3', label: 'Often' },
  { value: '4', label: 'Very often' },
]

/** Always → Never scale. */
const CONSISTENCY: QuestionOption[] = [
  { value: 'always', label: 'Always' },
  { value: 'usually', label: 'Usually' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'rarely', label: 'Rarely' },
  { value: 'never', label: 'Never' },
]

export const SECTIONS: Section[] = [
  {
    id: 's1',
    index: 1,
    title: 'How you feel with him',
    description:
      'Think about how you normally feel when you are with him, not just during one bad day.',
  },
  {
    id: 's2',
    index: 2,
    title: 'Arguments and anger',
    description: 'Think about what normally happens when the two of you disagree.',
  },
  {
    id: 's3',
    index: 3,
    title: 'Trust and insecurity',
    description:
      'These questions are about trust, jealousy and worries about losing each other. There are no right answers.',
  },
  {
    id: 's4',
    index: 4,
    title: 'Expectations and freedom',
    description: 'Think about whether you feel free to make your own choices.',
  },
  {
    id: 's5',
    index: 5,
    title: 'Communication',
    description:
      'These questions are about what happens when you tell him something is wrong, and how he treats your opinions.',
  },
  {
    id: 's6',
    index: 6,
    title: 'The positive side',
    description:
      'Relationships are not only about problems. Think about what he does well too.',
  },
  {
    id: 's7',
    index: 7,
    title: 'The harder truths',
    description:
      'These questions may be uncomfortable. Please answer honestly. You are not being mean by telling the truth.',
  },
  {
    id: 's8',
    index: 8,
    title: 'The most important questions',
    description:
      'These few questions matter more than the rest. Take a little extra time with them.',
    emphasis: true,
  },
  {
    id: 's9',
    index: 9,
    title: 'Final reflection',
    description: 'Two quick scores and one last thought, in your own words.',
  },
]

export const QUESTIONS: Question[] = [
  // ── Section 1 — How you feel with him ────────────────────────────────────
  {
    id: 'q1',
    sectionId: 's1',
    displayNumber: '1',
    title: 'When you are with him, do you usually feel safe and comfortable?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Safe means you can speak honestly, disagree, make mistakes, or say what you feel without being scared of his reaction.',
      example: 'You tell him something he may not like. Can you still feel comfortable saying it?',
    },
  },
  {
    id: 'q2',
    sectionId: 's1',
    displayNumber: '2',
    title: 'Can you be your real self when you are with him?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Can you talk, joke, dress and share your opinions in a natural way, without feeling that you must act differently to keep him happy?',
      example:
        'You are with him and you feel like being loud, quiet, silly or serious. Do you act the way you normally would, or a different way?',
    },
  },
  {
    id: 'q3',
    sectionId: 's1',
    displayNumber: '3',
    title: 'Do you feel that you must be careful about what you say to him?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about whether you check your words before you speak, and how often that happens.',
      example:
        'You want to make a normal joke, but you stop because you think he may take it the wrong way.',
    },
  },
  {
    id: 'q4',
    sectionId: 's1',
    displayNumber: '4',
    title:
      'Do you have to explain small things again and again so that he understands you correctly?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about saying the same thing again and again so that he understands what you mean.',
      example:
        'You say something casually. He thinks you meant something negative. You then have to explain what you really meant.',
    },
  },
  {
    id: 'q5',
    sectionId: 's1',
    displayNumber: '5',
    title: 'Do you feel loved by him?',
    required: false,
    type: 'rating',
    rating: { min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Completely' },
    info: {
      what: 'This is about your own feeling, not about what he says or what he does for you. Pick the number that matches how loved you feel most days.',
      example: '0 means you do not feel loved at all. 10 means you feel completely loved.',
      tip: 'Answer for how things usually are, not for one very good or one very bad day.',
    },
  },
  {
    id: 'q6',
    sectionId: 's1',
    displayNumber: '6',
    title: 'Do you feel tired because you argue again and again?',
    required: false,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about feeling tired because the same arguments happen again and again, not tired from work or daily life.',
      example:
        'The same disagreement comes up again and you notice you feel drained before it even starts.',
    },
  },

  // ── Section 2 — Arguments and anger ──────────────────────────────────────
  {
    id: 'q7',
    sectionId: 's2',
    displayNumber: '7',
    title: 'When he gets angry, what do you usually feel?',
    required: true,
    type: 'multi',
    options: [
      { value: 'angry', label: 'Angry' },
      { value: 'sad', label: 'Sad' },
      { value: 'scared', label: 'Scared' },
      { value: 'guilty', label: 'Guilty' },
      { value: 'confused', label: 'Confused' },
      { value: 'tired', label: 'Tired' },
      { value: 'frustrated', label: 'Frustrated' },
      { value: 'nothing', label: 'Nothing special' },
      { value: 'other', label: 'Something else', isOther: true },
    ],
    info: {
      what: 'There is no correct feeling here. Choose everything that is usually true for you. You can pick more than one.',
      example: 'He raises his voice, or goes quiet. What happens inside you in that moment?',
      tip: 'Choose what you usually feel, not only what you felt one time.',
    },
  },
  {
    id: 'q8',
    sectionId: 's2',
    displayNumber: '8',
    title: 'Do you feel safe when you disagree with him?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'This is about whether you can say a different opinion out loud.',
      example:
        "You believe something different from him. Can you say, 'I don't agree with you' without being afraid of his reaction?",
    },
  },
  {
    id: 'q9',
    sectionId: 's2',
    displayNumber: '9',
    title:
      'Do you decide not to talk about something because you think it may start a fight?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about subjects you do not talk about, because of what might happen if you do.',
      example:
        'There is something on your mind. You decide not to mention it today. How often does that happen?',
    },
  },
  {
    id: 'q10',
    sectionId: 's2',
    displayNumber: '10',
    title: 'During an argument, do you feel that he listens to you?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Listening means he really hears what you are saying, and is not just waiting for his turn to speak.',
      example: 'You are explaining your side. Do you feel he is following what you mean?',
    },
  },
  {
    id: 'q11',
    sectionId: 's2',
    displayNumber: '11',
    title:
      'Does he decide what you meant before you finish speaking?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about him deciding what you meant before you finish speaking.',
      example:
        'You start explaining. Partway through, he answers as if he already knows what you were going to say.',
    },
  },
  {
    id: 'q12',
    sectionId: 's2',
    displayNumber: '12',
    title: 'When you explain something to him, do you feel that he believes you?',
    required: true,
    type: 'scale',
    options: CONSISTENCY,
    info: {
      what: 'Believing you means he accepts that what you said is true, even if he is still upset.',
      example:
        'You explain what actually happened. Afterwards, does the subject settle, or does the same question come back?',
    },
  },
  {
    id: 'q13',
    sectionId: 's2',
    displayNumber: '13',
    title: "Have you ever thought, 'I am too tired to explain this to him again'?",
    required: false,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'This is about feeling too tired to have the same conversation again.',
      example:
        'Something comes up that you have explained before. What is your first reaction inside?',
    },
  },
  {
    id: 'q14',
    sectionId: 's2',
    displayNumber: '14',
    title: 'What is the most difficult part when you argue with him?',
    required: false,
    type: 'text',
    placeholder: 'The hardest part for me is…',
    recommendedChars: 20,
    info: {
      what: 'Think about what makes arguments difficult for you. It could be his anger, repeating the same point, asking many questions, not feeling heard, bringing up old issues, or something else entirely.',
      example: 'Write it in your own words. There is no right answer.',
      tip: 'A few sentences are enough.',
    },
  },
  {
    id: 'q15',
    sectionId: 's2',
    displayNumber: '15',
    title: 'What usually happens after a fight?',
    required: true,
    type: 'single',
    options: [
      { value: 'talk_solve', label: 'We talk and solve it' },
      { value: 'calm_later', label: 'We calm down and talk later' },
      { value: 'apology', label: 'One of us apologizes' },
      { value: 'stop_talking', label: 'We stop talking for some time' },
      { value: 'returns', label: 'The same issue comes back later' },
      { value: 'another_fight', label: 'It becomes another fight' },
      { value: 'unsolved', label: 'Nothing really gets solved' },
      { value: 'other', label: 'Other', isOther: true },
    ],
    info: {
      what: 'Choose what usually happens after most disagreements, not what happened one unusual time.',
      example: 'The argument ends. What normally happens in the hours or days after?',
    },
  },

  // ── Section 3 — Trust and insecurity ─────────────────────────────────────
  {
    id: 'q16',
    sectionId: 's3',
    displayNumber: '16',
    title: 'How much do you feel that he trusts you?',
    required: true,
    type: 'rating',
    rating: { min: 0, max: 10, minLabel: 'Not at all', maxLabel: 'Completely' },
    info: {
      what: 'This is your impression of how much he trusts you. 0 means not at all, 10 means completely.',
      example: 'Think about how he responds to ordinary things you do without him.',
    },
  },
  {
    id: 'q17',
    sectionId: 's3',
    displayNumber: '17',
    title: 'Does he sometimes worry that you may leave him for someone else?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about worry he expresses about losing you to someone else.',
      example: 'Think about whether this comes up in conversation, and how often.',
    },
  },
  {
    id: 'q18',
    sectionId: 's3',
    displayNumber: '18',
    title:
      'Does he sometimes think something is wrong even when you have not done anything wrong?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about him believing there is a problem when, from your side, nothing has happened.',
      example: 'You talk to someone normally, but he thinks there must be another reason.',
    },
  },
  {
    id: 'q19',
    sectionId: 's3',
    displayNumber: '19',
    title: 'Do you often have to tell him again that you love him and will not leave him?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'Reassuring means telling him again that you love him, or that you are not leaving.',
      example: 'Think about how often you find yourself saying this to settle a worry.',
    },
  },
  {
    id: 'q20',
    sectionId: 's3',
    displayNumber: '20',
    title: 'After you tell him that you love him, does he feel better only for a short time?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'This is about how long he feels better before the same worry comes back.',
      example: 'You reassure him and things feel calm. Does the same worry return later, or does it settle?',
    },
  },
  {
    id: 'q21',
    sectionId: 's3',
    displayNumber: '21',
    title: 'Do you feel that you have to prove that you are loyal to him?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about feeling that you must show proof, instead of just being believed.',
      example: 'Think about whether you offer explanations, messages or details to settle a doubt.',
    },
  },
  {
    id: 'q22',
    sectionId: 's3',
    displayNumber: '22',
    title: 'Do his worries ever make you change normal things that you do?',
    required: false,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'This is about changing ordinary parts of your day because of worries he has.',
      example:
        'Think about anything normal you now do differently than you would if you were deciding on your own.',
    },
  },
  {
    id: 'q22a',
    sectionId: 's3',
    displayNumber: '22a',
    title: 'What is one example?',
    required: false,
    type: 'text',
    placeholder: 'One example is…',
    recommendedChars: 20,
    condition: { questionId: 'q22', anyOf: ['yes', 'sometimes'] },
    info: {
      what: 'One or two sentences is enough. Write only what you are comfortable writing.',
      example: 'A specific, ordinary situation is more useful than a general description.',
    },
  },
  {
    id: 'q23',
    sectionId: 's3',
    displayNumber: '23',
    title:
      'Do you feel that you have to explain who you talked to, where you went, or what you did, even when nothing wrong happened?',
    required: false,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about explaining ordinary parts of your day.',
      example:
        'You come back from an ordinary outing. Think about what is usually asked, and how that feels to you.',
    },
  },

  // ── Section 4 — Expectations and freedom ─────────────────────────────────
  {
    id: 'q24',
    sectionId: 's4',
    displayNumber: '24',
    title: 'Do you feel free to make your own choices in this relationship?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Free means you can decide things for yourself, including small everyday things.',
      example:
        'You want to make a plan of your own. Do you decide it yourself, or does the decision depend on his reaction?',
    },
  },
  {
    id: 'q25',
    sectionId: 's4',
    displayNumber: '25',
    title: 'Does he expect you to act exactly the way he wants?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about him wanting one exact way of doing things.',
      example: 'You handle something in your own way. Think about what usually follows.',
    },
  },
  {
    id: 'q26',
    sectionId: 's4',
    displayNumber: '26',
    title: 'Does he get upset when you do something in a way he did not expect?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This means doing something in a way he did not imagine, even when nothing went wrong.',
      example: 'You do an ordinary task in a different way than he expected.',
    },
  },
  {
    id: 'q27',
    sectionId: 's4',
    displayNumber: '27',
    title: 'Does he expect you to understand what he wants without him telling you?',
    required: false,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about being expected to know his wishes without him saying them out loud.',
      example:
        "He expects you to do something because he thinks, 'If she really loves me, she should already know.'",
    },
  },
  {
    id: 'q28',
    sectionId: 's4',
    displayNumber: '28',
    title: 'Do you ever do something only to stop him from getting upset?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about doing something mainly to stop him getting upset, not because you wanted to.',
      example: 'You agree to something. Think about the main reason you agreed.',
    },
  },
  {
    id: 'q29',
    sectionId: 's4',
    displayNumber: '29',
    title: 'Do you feel that he wants to understand you, or that he mostly wants you to change?',
    required: false,
    type: 'single',
    options: [
      { value: 'understand', label: 'Mostly understand me' },
      { value: 'both', label: 'Both' },
      { value: 'change', label: 'Mostly change me' },
      { value: 'unsure', label: "I'm not sure" },
    ],
    info: {
      what: 'This asks where most of his effort goes: into understanding how you see things, or into changing how you act.',
      example: 'You explain how you feel. What usually happens next in the conversation?',
    },
  },
  {
    id: 'q30',
    sectionId: 's4',
    displayNumber: '30',
    title: 'Do you ever feel trapped or controlled in this relationship?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: "Being controlled does not only mean being told what to do. It can also mean feeling that you cannot make normal choices because you are worried about your partner's reaction.",
      example: 'Think about an ordinary decision. Do you feel free to make it either way?',
    },
  },
  {
    id: 'q31',
    sectionId: 's4',
    displayNumber: '31',
    title: 'What is one thing he does that he thinks is love, but feels controlling to you?',
    required: false,
    type: 'text',
    placeholder: 'One thing is…',
    recommendedChars: 20,
    info: {
      what: 'Some things are meant in a kind way, but they do not feel kind to you. This question is about that difference. If you cannot think of anything, you can skip it.',
      example: 'Write it in your own words, as plainly as you like.',
    },
  },

  // ── Section 5 — Communication ────────────────────────────────────────────
  {
    id: 'q32',
    sectionId: 's5',
    displayNumber: '32',
    title: 'Can you tell him when he hurts your feelings?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: "This is about being able to say 'that hurt me' out loud.",
      example: 'Something he said stayed with you. Do you tell him, or keep it to yourself?',
    },
  },
  {
    id: 'q33',
    sectionId: 's5',
    displayNumber: '33',
    title: 'When you tell him that something hurt you, does he try to understand first?',
    required: true,
    type: 'scale',
    options: CONSISTENCY,
    info: {
      what: 'Understanding first means he asks about your feeling before explaining his own side.',
      example: 'You say you were hurt. What is the first thing that usually happens?',
    },
  },
  {
    id: 'q34',
    sectionId: 's5',
    displayNumber: '34',
    title:
      'When you are hurt, does he first explain why you should not feel hurt, instead of listening to you?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about the order of the conversation: explaining before listening.',
      example: 'You say something hurt you. He responds by explaining why it should not have.',
    },
  },
  {
    id: 'q35',
    sectionId: 's5',
    displayNumber: '35',
    title: 'When you disagree with him, does he still respect your opinion, even if he does not agree?',
    required: false,
    type: 'scale',
    options: CONSISTENCY,
    info: {
      what: 'Respecting your opinion means treating it as fair, even when he does not agree with it.',
      example: 'You see something differently. How is your view treated in the conversation?',
    },
  },
  {
    id: 'q36',
    sectionId: 's5',
    displayNumber: '36',
    title: 'Does he ever make you feel guilty when you have a different opinion?',
    required: false,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about being made to feel that it is wrong of you to think differently.',
      example: 'You disagree about something ordinary. How do you feel afterwards?',
    },
  },
  {
    id: 'q37',
    sectionId: 's5',
    displayNumber: '37',
    title: 'What do you want him to understand about you better?',
    required: false,
    type: 'text',
    placeholder: 'I wish he understood…',
    recommendedChars: 20,
    info: {
      what: 'This can be about anything: how you think, what you need, your past, your work, your family, or your feelings.',
      example: 'Write it in your own words.',
    },
  },

  // ── Section 6 — The positive side ────────────────────────────────────────
  {
    id: 'q38',
    sectionId: 's6',
    displayNumber: '38',
    title: 'What does he do that makes you feel truly loved?',
    required: true,
    type: 'text',
    placeholder: 'I feel loved when he…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Think about the things he does that really make you feel loved.',
      example: 'It can be small and ordinary. Small things count.',
    },
  },
  {
    id: 'q39',
    sectionId: 's6',
    displayNumber: '39',
    title: 'What is your favourite thing about being with him?',
    required: false,
    type: 'text',
    placeholder: 'My favourite thing is…',
    recommendedChars: 20,
    info: {
      what: 'This is about what you enjoy about being together.',
      example: 'It can be a feeling, a habit you share, or something he is like.',
    },
  },
  {
    id: 'q40',
    sectionId: 's6',
    displayNumber: '40',
    title: 'When you have a difficult day, do you feel that he supports you?',
    required: false,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'Support means he answers in a way that really helps you on a hard day.',
      example: 'You have had a difficult day. What usually happens when you tell him?',
    },
  },
  {
    id: 'q41',
    sectionId: 's6',
    displayNumber: '41',
    title: 'Do you feel that he really cares about your happiness?',
    required: false,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'This is about whether his actions show that your happiness matters to him, not only his words.',
      example: 'Think about how he responds when something matters a lot to you.',
    },
  },
  {
    id: 'q42',
    sectionId: 's6',
    displayNumber: '42',
    title: 'What is something about him that you never want him to change?',
    required: false,
    type: 'text',
    placeholder: 'I never want him to change…',
    recommendedChars: 20,
    info: {
      what: 'Something you would not want to lose about him.',
      example: 'It can be a quality, a habit, or a way he treats you or other people.',
    },
  },

  // ── Section 7 — The harder truths ────────────────────────────────────────
  {
    id: 'q43',
    sectionId: 's7',
    displayNumber: '43',
    title: 'What part of this relationship makes you most tired?',
    required: true,
    type: 'text',
    placeholder: 'The most tiring part is…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Tiring can mean emotionally, mentally or physically. There is no wrong answer.',
      example: 'Write the part that takes the most out of you.',
    },
  },
  {
    id: 'q44',
    sectionId: 's7',
    displayNumber: '44',
    title: 'What does he do that hurts you the most?',
    required: true,
    type: 'text',
    placeholder: 'What hurts me most is…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'You are describing your own experience here. You are not blaming him.',
      example: 'One or two sentences is enough.',
    },
  },
  {
    id: 'q45',
    sectionId: 's7',
    displayNumber: '45',
    title:
      'What is something you are scared to tell him because you are worried about how he will react?',
    required: true,
    type: 'text',
    placeholder: 'I have not told him that…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'This is about something you keep to yourself because of how you think he might respond.',
      example: 'If there is nothing you hold back, you can write that instead. That is a real answer too.',
    },
  },
  {
    id: 'q46',
    sectionId: 's7',
    displayNumber: '46',
    title: 'What do you think he does not understand about you?',
    required: true,
    type: 'text',
    placeholder: 'He does not understand that I…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Something about you that you feel he has not understood.',
      example: 'It can be one specific thing rather than everything at once.',
    },
  },
  {
    id: 'q47',
    sectionId: 's7',
    displayNumber: '47',
    title: 'What do you think he does not understand about himself?',
    required: true,
    type: 'text',
    placeholder: 'I think he does not see that he…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'This is your honest view of him. It is your opinion, and that is fine.',
      example: 'Write what you have noticed, in your own words.',
    },
  },
  {
    id: 'q48',
    sectionId: 's7',
    displayNumber: '48',
    title: 'If you could remove ONE thing he does, forever, what would it be?',
    required: true,
    type: 'text',
    placeholder: 'The one behaviour is…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'One thing, not a list. Pick the one thing that matters most to you.',
      example: 'Describe the thing he does, not the reason you think he does it.',
    },
  },
  {
    id: 'q49',
    sectionId: 's7',
    displayNumber: '49',
    title: 'What is the biggest change you want from him?',
    required: true,
    type: 'text',
    placeholder: 'The biggest change I want is…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'The one change that would make the biggest difference to you.',
      example: 'It can be the same as your last answer, or something different.',
    },
  },
  {
    id: 'q50',
    sectionId: 's7',
    displayNumber: '50',
    title: 'Do you feel that he can always find something wrong, whatever you do?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'This is about whether he usually finds a problem with the things you do.',
      example: 'You do something you thought was fine. What usually follows?',
    },
  },
  {
    id: 'q51',
    sectionId: 's7',
    displayNumber: '51',
    title:
      'Do you feel that being right is more important to him than understanding you?',
    required: true,
    type: 'scale',
    options: FREQUENCY,
    info: {
      what: 'This is about what matters more to him in an argument: being right, or understanding you.',
      example: 'A disagreement ends. Think about what it was mostly about by the end.',
    },
  },

  // ── Section 8 — The most important questions ─────────────────────────────
  {
    id: 'q52',
    sectionId: 's8',
    displayNumber: '52',
    title:
      'If he does not change at all for the next 2 years, would you still want this relationship?',
    required: true,
    type: 'segmented',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'unsure', label: "I'm not sure" },
      { value: 'no', label: 'No' },
    ],
    info: {
      what: 'Imagine nothing changes at all, better or worse, for two years. Answer for that situation.',
      example: 'Not better, not worse. Exactly as things are today.',
      tip: "It is completely okay to answer 'I'm not sure'.",
    },
  },
  {
    id: 'q53',
    sectionId: 's8',
    displayNumber: '53',
    title: 'Do you feel happy in this relationship right now?',
    required: true,
    type: 'segmented',
    options: YES_SOMETIMES_NO,
    info: {
      what: 'This is about right now, not about how things were before or how you hope they will be.',
      example: 'Think about the last few weeks.',
    },
  },
  {
    id: 'q54',
    sectionId: 's8',
    displayNumber: '54',
    title:
      'What must change for you to feel happier and calmer in this relationship?',
    required: true,
    type: 'text',
    placeholder: 'For me to feel more at peace…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'This can include changes from him, changes from you, or changes from both of you.',
      example: 'Write it in your own words.',
    },
  },
  {
    id: 'q55',
    sectionId: 's8',
    displayNumber: '55',
    title:
      'If you could say ONE completely honest thing to him, and he would not be hurt, what would you say?',
    required: true,
    type: 'text',
    large: true,
    placeholder: 'What I would say is…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'Write it as if he would stay calm and accept it. Nothing here is sent to him.',
      example: 'Say it plainly, in your own words.',
      tip: 'This is often the most useful answer in the whole questionnaire. Take your time with it.',
    },
  },
  {
    id: 'q56',
    sectionId: 's8',
    displayNumber: '56',
    title: 'Do you feel more loved by him, or more responsible for keeping him happy?',
    required: true,
    type: 'single',
    options: [
      { value: 'loved', label: 'More loved' },
      { value: 'both', label: 'Both equally' },
      { value: 'responsible', label: 'More responsible for keeping him happy' },
      { value: 'unsure', label: "I'm not sure" },
    ],
    info: {
      what: 'Both can be true at the same time. Choose the one that is true more often.',
      example: 'Think about where most of your energy goes in the relationship.',
    },
  },
  {
    id: 'q57',
    sectionId: 's8',
    displayNumber: '57',
    title:
      'Do you feel that he trusts you, or that you must keep proving your love again and again?',
    required: true,
    type: 'single',
    options: [
      { value: 'trusts', label: 'He trusts me' },
      { value: 'both', label: 'Both' },
      { value: 'proving', label: 'He needs me to keep proving it' },
      { value: 'unsure', label: "I'm not sure" },
    ],
    info: {
      what: 'This is about whether he simply trusts you, or whether you have to earn his trust again and again.',
      example: 'Think about how often the subject of trust comes up between you.',
    },
  },
  {
    id: 'q58',
    sectionId: 's8',
    displayNumber: '58',
    title: 'In general, how would you describe this relationship?',
    required: true,
    type: 'multi',
    maxSelections: 3,
    options: [
      { value: 'loved', label: 'Loved' },
      { value: 'safe', label: 'Safe' },
      { value: 'happy', label: 'Happy' },
      { value: 'comfortable', label: 'Comfortable' },
      { value: 'understood', label: 'Understood' },
      { value: 'supported', label: 'Supported' },
      { value: 'tired', label: 'Tired' },
      { value: 'confused', label: 'Confused' },
      { value: 'restricted', label: 'Restricted' },
      { value: 'anxious', label: 'Anxious' },
      { value: 'frustrated', label: 'Frustrated' },
      { value: 'exhausted', label: 'Emotionally exhausted' },
      { value: 'hopeful', label: 'Hopeful' },
      { value: 'other', label: 'Other', isOther: true },
    ],
    info: {
      what: 'Choose up to three words that describe the relationship overall. Good words and difficult words are both on the list, and you can mix them.',
      example: 'Pick the words you would use if nobody else were going to read them.',
      tip: 'Choose what is usually true, not only what is true today.',
    },
  },

  // ── Section 9 — Final reflection ─────────────────────────────────────────
  {
    id: 'q59',
    sectionId: 's9',
    displayNumber: '59',
    title: 'How would you score this relationship from 0 to 10, based on how it feels right now?',
    required: true,
    type: 'rating',
    rating: {
      min: 0,
      max: 10,
      minLabel: 'Extremely difficult',
      maxLabel: 'Very healthy and happy',
    },
    info: {
      what: 'This score is about the relationship as a whole, as it feels to you today.',
      example: '0 means extremely difficult. 10 means very healthy and happy.',
    },
  },
  {
    id: 'q60',
    sectionId: 's9',
    displayNumber: '60',
    title: 'How would you score him as a partner, from 0 to 10?',
    required: true,
    type: 'rating',
    rating: { min: 0, max: 10, minLabel: 'Very difficult for me', maxLabel: 'Excellent partner' },
    info: {
      what: 'This score is about how he acts as a partner. It can be different from your score for the whole relationship.',
      example: '0 means very difficult for you. 10 means an excellent partner.',
    },
  },
  {
    id: 'q61',
    sectionId: 's9',
    displayNumber: '61',
    title: 'What is ONE thing you want him to understand after reading your answers?',
    required: true,
    type: 'text',
    large: true,
    placeholder: 'The one thing I want him to understand is…',
    helper: OPEN_HELPER,
    recommendedChars: 20,
    info: {
      what: 'One thing only. If he read all of your answers, what is the one thing you would want him to remember?',
      example: 'Write it as the last line of the questionnaire.',
    },
  },
]

/** All questions belonging to a section, in display order. */
export function questionsForSection(sectionId: string): Question[] {
  return QUESTIONS.filter((q) => q.sectionId === sectionId)
}

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id)
}

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id)
}

/** Human-readable label for a stored option value. */
export function labelForValue(question: Question, value: string): string {
  return question.options?.find((o) => o.value === value)?.label ?? value
}
