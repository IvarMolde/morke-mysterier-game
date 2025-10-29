import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import introImage from "@/assets/detective-intro.jpg";
import warehouseImage from "@/assets/warehouse.jpg";
import alleyImage from "@/assets/alley.jpg";

type Choice = {
  text: string;
  nextScene: string;
  points?: number;
  correctAnswer?: boolean;
};

type Scene = {
  id: string;
  title: string;
  text: string;
  image: string;
  choices: Choice[];
  question?: string;
};

const scenes: Record<string, Scene> = {
  intro: {
    id: "intro",
    title: "En mørk natt",
    text: "Du er detektiv i en mørk by. Det regner. Du får en telefon. 'Hjelp meg!' sier en stemme. 'Kom til det gamle lageret!' Stemmen stopper.",
    image: introImage,
    question: "Hvordan er været?",
    choices: [
      { text: "Det regner", nextScene: "weather", points: 10, correctAnswer: true },
      { text: "Det snør", nextScene: "weather", points: 0, correctAnswer: false },
      { text: "Det er sol", nextScene: "weather", points: 0, correctAnswer: false }
    ]
  },
  weather: {
    id: "weather",
    title: "Du går ut",
    text: "Riktig! Det regner. Du tar på jakken din. Du går ut i regnet. Gatene er våte. Hva gjør du nå?",
    image: introImage,
    choices: [
      { text: "Gå til lageret", nextScene: "warehouse", points: 10 },
      { text: "Ring politiet først", nextScene: "police", points: 5 }
    ]
  },
  warehouse: {
    id: "warehouse",
    title: "Det gamle lageret",
    text: "Du kommer til lageret. Det er veldig mørkt. Du hører en lyd inne i bygningen. Døren er åpen.",
    image: warehouseImage,
    question: "Hvilken setning er riktig?",
    choices: [
      { text: "Lageret er mørkt", nextScene: "doorTask", points: 15, correctAnswer: true },
      { text: "Lageret er lyst", nextScene: "doorTask", points: 0, correctAnswer: false },
      { text: "Lageret er varmt", nextScene: "doorTask", points: 0, correctAnswer: false }
    ]
  },
  doorTask: {
    id: "doorTask",
    title: "Ved døren",
    text: "Du står ved døren. På døren er det et skilt. Det står: 'Bare de modige kan komme inn.' Du må svare: Hva betyr 'modig'?",
    image: warehouseImage,
    question: "Hva betyr 'modig'?",
    choices: [
      { text: "En som ikke er redd", nextScene: "inside", points: 15, correctAnswer: true },
      { text: "En som er trøtt", nextScene: "inside", points: 0, correctAnswer: false },
      { text: "En som er sulten", nextScene: "inside", points: 0, correctAnswer: false }
    ]
  },
  inside: {
    id: "inside",
    title: "Inne i lageret",
    text: "Du går inn. Det er kaldt. Du ser skygger på veggen. På gulvet ligger det en lapp. Du leser den.",
    image: warehouseImage,
    question: "På lappen står: 'Gå til høyre for å finne meg.' Hvor skal du gå?",
    choices: [
      { text: "Til høyre", nextScene: "rightPath", points: 15, correctAnswer: true },
      { text: "Til venstre", nextScene: "wrongPath", points: 5, correctAnswer: false },
      { text: "Rett fram", nextScene: "wrongPath", points: 5, correctAnswer: false }
    ]
  },
  rightPath: {
    id: "rightPath",
    title: "Den riktige veien",
    text: "Bra! Du går til høyre. Du finner en trapp. På veggen er det skrevet: 'Det du søker er ___ trappen.' Hvilket ord passer?",
    image: warehouseImage,
    question: "Hvilket ord passer i setningen?",
    choices: [
      { text: "oppe", nextScene: "upstairs", points: 15, correctAnswer: true },
      { text: "nede", nextScene: "upstairs", points: 0, correctAnswer: false },
      { text: "utenfor", nextScene: "upstairs", points: 0, correctAnswer: false }
    ]
  },
  wrongPath: {
    id: "wrongPath",
    title: "Feil vei",
    text: "Du går feil vei. Det er en blindgate. Du må gå tilbake. Du ser lappen igjen.",
    image: warehouseImage,
    question: "Hva skal du gjøre når det står 'til høyre'?",
    choices: [
      { text: "Gå til høyre", nextScene: "rightPath", points: 10, correctAnswer: true },
      { text: "Gå til venstre", nextScene: "wrongPath", points: 0, correctAnswer: false }
    ]
  },
  upstairs: {
    id: "upstairs",
    title: "Oppe på trappen",
    text: "Du går opp trappen. Det knirker. Oppe finner du et bord. På bordet ligger en gammel bok.",
    image: warehouseImage,
    question: "Hva gjorde trappen?",
    choices: [
      { text: "Den knirket", nextScene: "bookTask", points: 15, correctAnswer: true },
      { text: "Den sang", nextScene: "bookTask", points: 0, correctAnswer: false },
      { text: "Den løp", nextScene: "bookTask", points: 0, correctAnswer: false }
    ]
  },
  bookTask: {
    id: "bookTask",
    title: "Den mystiske boken",
    text: "Du åpner boken. På den første siden står det: 'Jeg er ___ og jeg trenger hjelp. Finn meg i det mørke smuget.' Hvilket ord mangler?",
    image: warehouseImage,
    question: "Hvilket ord passer i setningen?",
    choices: [
      { text: "redd", nextScene: "bookClue", points: 15, correctAnswer: true },
      { text: "glad", nextScene: "bookClue", points: 0, correctAnswer: false },
      { text: "sint", nextScene: "bookClue", points: 0, correctAnswer: false }
    ]
  },
  bookClue: {
    id: "bookClue",
    title: "Et hint",
    text: "Riktig! Personen er redd. I boken er det et bilde av et smug med gatelys. Du må finne smuget!",
    image: alleyImage,
    question: "Hvor må du gå?",
    choices: [
      { text: "Til smuget", nextScene: "alleyEntrance", points: 15, correctAnswer: true },
      { text: "Hjem", nextScene: "alleyEntrance", points: 0, correctAnswer: false }
    ]
  },
  alleyEntrance: {
    id: "alleyEntrance",
    title: "Utenfor lageret",
    text: "Du går ut av lageret. Det regner fortsatt. Du ser et smug mellom to bygninger. Det er veldig mørkt der.",
    image: alleyImage,
    question: "Hva ser du?",
    choices: [
      { text: "Et smug", nextScene: "alleyTask", points: 10, correctAnswer: true },
      { text: "En butikk", nextScene: "alleyTask", points: 0, correctAnswer: false },
      { text: "En park", nextScene: "alleyTask", points: 0, correctAnswer: false }
    ]
  },
  alleyTask: {
    id: "alleyTask",
    title: "I smuget",
    text: "Du går inn i smuget. Du hører en lyd. 'Er du her?' spør du. 'Ja! Jeg er her!' svarer en stemme.",
    image: alleyImage,
    question: "Hva gjør du?",
    choices: [
      { text: "Jeg spør: Hvor er du?", nextScene: "finalTask", points: 15, correctAnswer: true },
      { text: "Jeg løper bort", nextScene: "finalTask", points: 0, correctAnswer: false }
    ]
  },
  finalTask: {
    id: "finalTask",
    title: "Siste oppgave",
    text: "Stemmen sier: 'Jeg er bak de ___ boksene.' Hvilket ord passer?",
    image: alleyImage,
    question: "Hvilket ord passer i setningen?",
    choices: [
      { text: "store", nextScene: "success", points: 20, correctAnswer: true },
      { text: "liten", nextScene: "success", points: 0, correctAnswer: false },
      { text: "gule", nextScene: "success", points: 0, correctAnswer: false }
    ]
  },
  success: {
    id: "success",
    title: "Du klarte det!",
    text: "Du finner personen bak de store boksene! 'Takk for hjelpen! Jeg var så redd,' sier personen. 'Du er en god detektiv!' Du løste mysteriet!",
    image: alleyImage,
    choices: [
      { text: "Spill på nytt", nextScene: "intro", points: 0 }
    ]
  },
  police: {
    id: "police",
    title: "Du ringer politiet",
    text: "Du ringer politiet. De kommer for sent. Personen som trengte hjelp er borte. Du mislyktes.",
    image: introImage,
    choices: [
      { text: "Prøv igjen", nextScene: "intro", points: 0 }
    ]
  },
};

export default function GameScene() {
  const [currentScene, setCurrentScene] = useState<string>("intro");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  const scene = scenes[currentScene];

  const handleChoice = (choice: Choice) => {
    const newScore = score + (choice.points || 0);
    setScore(newScore);
    
    if (scene.question && choice.correctAnswer !== undefined) {
      if (choice.correctAnswer) {
        setFeedback("✓ Riktig!");
      } else {
        setFeedback("✗ Feil svar");
      }
      setTimeout(() => {
        setFeedback("");
        setCurrentScene(choice.nextScene);
      }, 1500);
    } else {
      setCurrentScene(choice.nextScene);
    }

    if (choice.nextScene === "intro" && currentScene !== "intro") {
      setScore(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-shadow p-4 relative overflow-hidden">
      {/* Rain effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-foreground/30"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 100 + 50}px`,
              animation: `rain ${Math.random() * 2 + 1}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-glow">Detektiv Mysteriet</h1>
          <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-2">
            Poeng: {score}
          </Badge>
        </div>

        {/* Main game card */}
        <Card className="bg-card border-border overflow-hidden animate-fade-in">
          {/* Scene image */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img 
              src={scene.image} 
              alt={scene.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          </div>

          {/* Scene content */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
              {scene.title}
            </h2>
            
            <p className="text-lg md:text-xl mb-6 leading-relaxed text-foreground/90">
              {scene.text}
            </p>

            {scene.question && (
              <div className="mb-6 p-4 bg-muted rounded-lg border border-accent/30">
                <p className="font-semibold text-accent mb-2">
                  📝 Oppgave:
                </p>
                <p className="text-foreground">{scene.question}</p>
              </div>
            )}

            {feedback && (
              <div className={`mb-4 p-3 rounded-lg text-center font-bold text-lg ${
                feedback.includes("Riktig") 
                  ? "bg-green-900/30 text-green-400" 
                  : "bg-destructive/30 text-destructive-foreground"
              }`}>
                {feedback}
              </div>
            )}

            {/* Choices */}
            <div className="space-y-3">
              {scene.choices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left justify-start h-auto py-4 px-6 text-base md:text-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-all duration-300 border border-border hover:border-accent"
                  disabled={feedback !== ""}
                >
                  <span className="mr-3 text-secondary">→</span>
                  {choice.text}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer info */}
        <div className="mt-6 text-center text-muted-foreground text-sm animate-fade-in">
          <p>🔍 Les nøye og velg ditt neste steg</p>
        </div>
      </div>
    </div>
  );
}
